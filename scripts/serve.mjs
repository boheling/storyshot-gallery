// Local preview only. GitHub Pages serves the same static files in production.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.GALLERY_PORT || 4176);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".md": "text/plain; charset=utf-8",
  ".yaml": "text/plain; charset=utf-8",
  ".srt": "text/plain; charset=utf-8",
};
http
  .createServer((request, response) => {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405);
      response.end();
      return;
    }
    let file;
    try {
      let pathname = decodeURIComponent(
        new URL(request.url, `http://127.0.0.1:${port}`).pathname,
      );
      if (pathname.endsWith("/")) pathname += "index.html";
      file = path.resolve(root, `.${pathname}`);
      if (!file.startsWith(root + path.sep) || file.includes("\0"))
        throw new Error("Outside root");
    } catch {
      response.writeHead(400);
      response.end("Invalid path");
      return;
    }
    let stat;
    try {
      stat = fs.statSync(file);
      if (!stat.isFile()) throw new Error("Not a file");
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    const headers = {
      "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    };
    let start = 0,
      end = stat.size - 1,
      status = 200;
    if (request.headers.range) {
      const match = request.headers.range.match(/^bytes=(\d*)-(\d*)$/);
      if (match && (match[1] || match[2])) {
        start = match[1]
          ? Number(match[1])
          : Math.max(0, stat.size - Number(match[2]));
        end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
        status = 206;
      }
      if (
        !match ||
        (!match[1] && !match[2]) ||
        start >= stat.size ||
        start > end
      ) {
        response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
        response.end();
        return;
      }
      headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
    }
    headers["Content-Length"] = Math.max(0, end - start + 1);
    response.writeHead(status, headers);
    if (request.method === "HEAD" || stat.size === 0) {
      response.end();
      return;
    }
    const stream = fs.createReadStream(file, { start, end });
    stream.on("error", () => response.destroy());
    response.on("close", () => stream.destroy());
    stream.pipe(response);
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`Storyshot preview: http://127.0.0.1:${port}`),
  );
