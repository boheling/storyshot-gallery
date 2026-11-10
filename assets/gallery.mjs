import {
  copy,
  films,
  order,
  languageNames,
  categoryOrder,
  stills,
} from "./content.mjs";

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
let savedLanguage;
try {
  savedLanguage = localStorage.getItem("storyshot-language");
} catch {
  /* Storage is optional. */
}
let language = [params.get("lang"), savedLanguage, "zh"].find((value) =>
  ["zh", "en"].includes(value),
);
const initialCollection = params.get("collection") || location.hash.slice(1);
const state = {
  collection: categoryOrder.includes(initialCollection)
    ? initialCollection
    : "all",
  query: params.get("q") || "",
  limit: 9,
};
let items = [],
  types = [],
  activeFilm = null,
  activeTab = "watch",
  documentRequest = null,
  loadRequest = null,
  catalogueState = "loading";
const dialog = $("#film-dialog");
const dialogContent = $("#dialog-content");
const t = (key) => copy[language][key] ?? key;
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const clock = (value) => {
  if (!Number.isFinite(value)) return "";
  const seconds = Math.max(0, Math.round(value));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};
const titleOf = (item) =>
  item.id === "pitch"
    ? t("pitchTitle")
    : films[item.id]?.[language === "zh" ? 0 : 1] || item.title;
const summaryOf = (item) =>
  item.id === "pitch"
    ? t("pitchSummary")
    : films[item.id]?.[language === "zh" ? 2 : 3] || item.request || "";
const languageOf = (item) =>
  languageNames[language][item.lang] || item.lang || "";
const categoryOf = (item) =>
  item.id === "pitch" ? t("pitchCategory") : t(item.category);
const playIcon =
  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5 11 6 3 10.5z" fill="currentColor"/></svg>';

// The films themselves are release assets, not files in this repository: keeping every
// re-rendered MP4 in git had taken the history past 400 MB and it only ever grew — a film
// revised twice sits in there three times, forever. Posters, storyboards, subtitles and the
// production notes all stay local, where localAsset()'s same-origin guard still applies.
// `explainer/mrna-cancer-vaccine/video.mp4` → `explainer-mrna-cancer-vaccine.mp4`.
// GitHub serves these as application/octet-stream with an attachment disposition; browsers
// play and seek them anyway (checked in a real browser, including seeking, before the
// history was rewritten).
const FILM_BASE =
  "https://github.com/boheling/storyshot-gallery/releases/download/media/";
function filmURL(value) {
  if (!value) return null;
  return `${FILM_BASE}${value.replace(/\/video\.mp4$/, "").replace(/\//g, "-")}.mp4`;
}
function localAsset(value) {
  if (!value) return null;
  const resolved = new URL(value, document.baseURI);
  const root = new URL(".", document.baseURI);
  return resolved.origin === root.origin &&
    resolved.pathname.startsWith(root.pathname)
    ? resolved.href
    : null;
}
function externalURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
function updateURL() {
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  state.collection === "all"
    ? url.searchParams.delete("collection")
    : url.searchParams.set("collection", state.collection);
  state.query
    ? url.searchParams.set("q", state.query)
    : url.searchParams.delete("q");
  activeFilm
    ? url.searchParams.set("film", activeFilm.id)
    : url.searchParams.delete("film");
  history.replaceState(null, "", url);
}

function setLanguage(next, persist = true) {
  language = next;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });
  document
    .querySelectorAll("[data-language]")
    .forEach((node) =>
      node.setAttribute(
        "aria-pressed",
        String(node.dataset.language === language),
      ),
    );
  $(".hero-translation").lang = language === "zh" ? "en" : "zh-CN";
  $(".about-title > p").lang = language === "zh" ? "en" : "zh-CN";
  if (persist) {
    try {
      localStorage.setItem("storyshot-language", language);
    } catch {
      /* Private browsing still works. */
    }
  }
  if (items.length) {
    renderFilters();
    renderFilms();
  } else if (catalogueState === "error") renderLoadError();
  if (activeFilm) {
    renderDialogHeading();
    renderTabs();
    renderTab(activeTab, false);
  }
  if (persist) updateURL();
}

function renderFilters() {
  $("#filters").innerHTML = categoryOrder
    .filter((id) => id === "all" || types.some((type) => type.id === id))
    .map((id) => {
      const count =
        id === "all"
          ? items.length
          : items.filter((item) => item.category === id).length;
      return `<button class="filter" type="button" data-collection="${id}" aria-pressed="${state.collection === id}">${esc(t(id))}<span class="filter-count">${count}</span></button>`;
    })
    .join("");
}
function filteredItems() {
  const query = state.query.trim().toLocaleLowerCase();
  return items.filter((item) => {
    if (state.collection !== "all" && item.category !== state.collection)
      return false;
    const searchable = [
      item.title,
      item.site,
      item.request,
      ...(films[item.id] || []),
      copy.zh[item.category],
      copy.en[item.category],
      languageNames.zh[item.lang],
      languageNames.en[item.lang],
    ]
      .join(" ")
      .toLocaleLowerCase();
    return !query || searchable.includes(query);
  });
}
function renderFilms() {
  const filtered = filteredItems();
  const visible = filtered.slice(0, state.limit);
  const grid = $("#film-grid");
  grid.setAttribute("aria-busy", "false");
  $("#result-count").textContent = `${filtered.length} ${t("filmCount")}`;
  grid.innerHTML = visible.length
    ? visible
        .map(
          (item) => `
    <article class="film-card">
      <button class="film-thumbnail" type="button" data-play="${esc(item.id)}" aria-label="${esc(t("play") + ": " + titleOf(item))}">
        <img src="${esc(localAsset(stills[item.id] || item.poster))}" alt="" loading="lazy" decoding="async" width="640" height="360">
        <span class="thumbnail-shade" aria-hidden="true"></span><span class="thumbnail-play">${playIcon}${esc(t("watch"))}</span><span class="film-duration">${clock(item.seconds)}</span>
      </button>
      <div class="film-meta"><span>${esc(categoryOf(item))}</span><span class="film-language">${esc(languageOf(item))}</span></div>
      <h3><button class="film-title-button" type="button" data-play="${esc(item.id)}">${esc(titleOf(item))}</button></h3>
      <p class="film-summary">${esc(summaryOf(item))}</p>
      ${item.notes ? `<button class="note-link" type="button" data-notes="${esc(item.id)}" aria-label="${esc(t("notes") + ": " + titleOf(item))}">${esc(t("notes"))}</button>` : ""}
    </article>`,
        )
        .join("")
    : `<div class="empty-state"><h3>${esc(t("emptyTitle"))}</h3><p>${esc(t("emptyText"))}</p><button type="button" data-clear>${esc(t("clearSearch"))}</button></div>`;
  $("#show-more").hidden = visible.length >= filtered.length;
}

async function loadGallery() {
  catalogueState = "loading";
  $("#film-grid").setAttribute("aria-busy", "true");
  $("#film-grid").innerHTML =
    `<p class="loading">${esc(t("loadingFilms"))}</p>`;
  try {
    const response = await fetch("gallery.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.some((type) => !Array.isArray(type.items)))
      throw new Error("Invalid catalogue");
    catalogueState = "ready";
    types = data;
    items = types.flatMap((type) =>
      type.items.map((item) => ({ ...item, category: type.id })),
    );
    items.sort((a, b) => {
      const ai = order.indexOf(a.id),
        bi = order.indexOf(b.id);
      return (ai === -1 ? order.length : ai) - (bi === -1 ? order.length : bi);
    });
    renderFilters();
    renderFilms();
    if (categoryOrder.includes(location.hash.slice(1)))
      $("#films").scrollIntoView({ behavior: "instant" });
    const featured = items.find(
      (item) => item.id === "explainer/mrna-cancer-vaccine",
    );
    if (featured)
      $("[data-feature-duration]").textContent = clock(featured.seconds);
    const linkedFilm = new URLSearchParams(location.search).get("film");
    if (
      linkedFilm &&
      !activeFilm &&
      (linkedFilm === "pitch" || items.some((item) => item.id === linkedFilm))
    )
      openFilm(linkedFilm, "watch", false);
    return true;
  } catch {
    catalogueState = "error";
    renderLoadError();
    return false;
  }
}

function renderLoadError() {
  $("#film-grid").setAttribute("aria-busy", "false");
  $("#show-more").hidden = true;
  $("#film-grid").innerHTML =
    `<div class="empty-state" role="alert"><h3>${esc(t("loadErrorTitle"))}</h3><p>${esc(t("loadErrorText"))}</p><button type="button" data-reload>${esc(t("retry"))}</button><a class="note-link" href="https://github.com/boheling/storyshot-gallery">${esc(t("archive"))}</a></div>`;
}

const pitch = {
  id: "pitch",
  title: "Storyshot",
  video: "pitch/video.mp4",
  poster: "pitch/poster.jpg",
  lang: "en",
  seconds: 68,
};
async function openFilm(id, tab = "watch", autoplay = true) {
  if (!items.length && loadRequest) await loadRequest;
  const item =
    id === "pitch" ? pitch : items.find((candidate) => candidate.id === id);
  if (!item) {
    $("#films").scrollIntoView({ behavior: "instant" });
    return;
  }
  activeFilm = item;
  activeTab = tab;
  renderDialogHeading();
  renderTabs();
  if (!dialog.open) {
    dialog.showModal();
    document.body.classList.add("modal-open");
    $("#close-dialog").focus();
  }
  renderTab(tab, autoplay);
  updateURL();
}
function renderDialogHeading() {
  $("#film-title").textContent = titleOf(activeFilm);
  $("#film-meta").textContent =
    `${categoryOf(activeFilm)} / ${languageOf(activeFilm)} / ${clock(activeFilm.seconds)}`;
  $("#film-description").textContent = summaryOf(activeFilm);
}
function renderTabs() {
  const available = [
    "watch",
    ...["notes", "storyboard", "article"].filter((key) => activeFilm[key]),
  ];
  $("#film-tabs").innerHTML =
    available
      .map(
        (key) =>
          `<button type="button" data-tab="${key}" aria-pressed="${activeTab === key}">${esc(t(key))}</button>`,
      )
      .join("") +
    (externalURL(activeFilm.url)
      ? `<a href="${esc(externalURL(activeFilm.url))}" target="_blank" rel="noopener">${esc(t("visitSite"))}</a>`
      : "");
}
function clearPlayer() {
  documentRequest?.abort();
  const video = dialogContent.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  dialogContent.replaceChildren();
}
async function renderTab(tab, autoplay = false) {
  activeTab = tab;
  clearPlayer();
  renderTabs();
  if (tab === "watch") {
    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = filmURL(activeFilm.video);
    video.poster = localAsset(stills[activeFilm.id] || activeFilm.poster);
    video.setAttribute("aria-label", titleOf(activeFilm));
    video.addEventListener(
      "error",
      () => {
        if (
          !activeFilm ||
          activeTab !== "watch" ||
          !video.isConnected ||
          video.error?.code === 1
        )
          return;
        const error = document.createElement("div");
        error.className = "document-error";
        error.setAttribute("role", "alert");
        error.innerHTML = `<p>${esc(t("videoError"))}</p><a href="${esc(filmURL(activeFilm.video))}" target="_blank" rel="noopener">${esc(t("openVideo"))}</a>`;
        video.replaceWith(error);
      },
      { once: true },
    );
    dialogContent.append(video);
    if (autoplay)
      video.play().catch(() => {
        /* Native controls remain available if autoplay is blocked. */
      });
    return;
  }
  const file = activeFilm[tab];
  const url = localAsset(file);
  const notice = `<p class="document-notice">${esc(t("originalLanguage"))}</p>`;
  dialogContent.innerHTML =
    notice + `<p class="loading" role="status">${esc(t("loading"))}</p>`;
  const request = new AbortController();
  documentRequest = request;
  try {
    if (!url) throw new Error("Missing document");
    const response = await fetch(url, { signal: request.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (request.signal.aborted || !dialog.open) return;
    if (tab === "storyboard")
      dialogContent.innerHTML =
        notice + `<pre class="source-code">${esc(text)}</pre>`;
    else
      dialogContent.innerHTML =
        notice +
        `<article class="source-document">${renderMarkdown(text, url)}</article>`;
  } catch (error) {
    if (error.name === "AbortError" || request.signal.aborted) return;
    dialogContent.innerHTML =
      notice +
      `<div class="document-error" role="alert"><p>${esc(t("documentError"))}</p><button class="retry-button" type="button" data-retry-document>${esc(t("retry"))}</button>${url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(t("openOriginal"))}</a>` : ""}</div>`;
  }
}

// Small, escaped Markdown renderer for the existing production notes and guides.
// No raw HTML, executable URLs or remote embedded images are accepted.
function renderMarkdown(markdown, base) {
  const inline = (text) =>
    esc(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_all, label, href) => {
        try {
          const url = new URL(href.replace(/&amp;/g, "&"), base);
          return ["http:", "https:"].includes(url.protocol)
            ? `<a href="${esc(url.href)}" target="_blank" rel="noopener">${label}</a>`
            : label;
        } catch {
          return label;
        }
      });
  const output = [];
  let paragraph = [],
    list = null,
    code = null,
    table = [];
  const flush = () => {
    if (paragraph.length) {
      output.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };
  const endList = () => {
    if (list) {
      output.push(`</${list}>`);
      list = null;
    }
  };
  const endTable = () => {
    if (!table.length) return;
    const rows = table
      .filter((row) => !/^\|[\s:|\-]+\|?$/.test(row))
      .map((row) =>
        row
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => inline(cell.trim())),
      );
    if (rows.length)
      output.push(
        `<div class="document-table"><table><thead><tr>${rows[0].map((cell) => `<th scope="col">${cell}</th>`).join("")}</tr></thead><tbody>${rows
          .slice(1)
          .map(
            (row) =>
              `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
          )
          .join("")}</tbody></table></div>`,
      );
    table = [];
  };
  for (const line of markdown.replace(/\r/g, "").split("\n")) {
    if (code === null && /^\s*\|/.test(line)) {
      flush();
      endList();
      table.push(line.trim());
      continue;
    }
    endTable();
    if (/^\s*```/.test(line)) {
      flush();
      endList();
      if (code !== null) {
        output.push(`<pre>${esc(code.join("\n"))}</pre>`);
        code = null;
      } else code = [];
      continue;
    }
    if (code !== null) {
      code.push(line);
      continue;
    }
    if (!line.trim()) {
      flush();
      endList();
      continue;
    }
    let match;
    if ((match = line.match(/^(#{1,6})\s+(.+)/))) {
      flush();
      endList();
      const level = Math.min(4, match[1].length + 1);
      output.push(`<h${level}>${inline(match[2])}</h${level}>`);
    } else if ((match = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/))) {
      flush();
      endList();
      try {
        const imageURL = new URL(match[2], base);
        if (imageURL.origin === location.origin && localAsset(imageURL.href))
          output.push(
            `<img src="${esc(imageURL.href)}" alt="${esc(match[1])}" loading="lazy">`,
          );
      } catch {
        /* Invalid assets do not become markup. */
      }
    } else if ((match = line.match(/^\s*(?:([-*])|\d+\.)\s+(.+)/))) {
      flush();
      const type = match[1] ? "ul" : "ol";
      if (list !== type) {
        endList();
        output.push(`<${type}>`);
        list = type;
      }
      output.push(`<li>${inline(match[2])}</li>`);
    } else {
      endList();
      paragraph.push(line.trim());
    }
  }
  flush();
  endList();
  endTable();
  if (code !== null) output.push(`<pre>${esc(code.join("\n"))}</pre>`);
  return output.join("");
}

function closeFilm() {
  dialog.close();
}
dialog.addEventListener("close", () => {
  clearPlayer();
  activeFilm = null;
  document.body.classList.remove("modal-open");
  updateURL();
});
$("#close-dialog").addEventListener("click", closeFilm);
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    closeFilm();
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.language) {
    setLanguage(button.dataset.language);
    return;
  }
  if (button.dataset.play) {
    openFilm(button.dataset.play);
    return;
  }
  if (button.dataset.notes) {
    openFilm(button.dataset.notes, "notes", false);
    return;
  }
  if (button.dataset.tab) {
    renderTab(button.dataset.tab, button.dataset.tab === "watch");
    $(`[data-tab="${activeTab}"]`).focus({ preventScroll: true });
    return;
  }
  if (button.hasAttribute("data-retry-document")) {
    renderTab(activeTab);
    return;
  }
  if (button.hasAttribute("data-reload")) {
    loadRequest = loadGallery();
    return;
  }
  if (button.hasAttribute("data-clear")) {
    state.query = "";
    state.collection = "all";
    state.limit = 9;
    $("#search-input").value = "";
    renderFilters();
    renderFilms();
    updateURL();
    $("#search-input").focus();
    return;
  }
  if (button.dataset.collection) {
    state.collection = button.dataset.collection;
    state.limit = 9;
    renderFilters();
    renderFilms();
    updateURL();
    $(`[data-collection="${state.collection}"]`).focus({ preventScroll: true });
  }
});
$("#show-more").addEventListener("click", () => {
  const previous = Math.min(state.limit, filteredItems().length);
  state.limit += 9;
  renderFilms();
  $("#film-grid")
    .children[previous]?.querySelector("button")
    ?.focus({ preventScroll: true });
});
$(".search").addEventListener("submit", (event) => event.preventDefault());
$("#search-input").value = state.query;
$("#search-input").addEventListener("input", (event) => {
  state.query = event.target.value;
  state.limit = 9;
  renderFilms();
  updateURL();
});
window.addEventListener("hashchange", () => {
  const category = location.hash.slice(1);
  if (categoryOrder.includes(category)) {
    state.collection = category;
    state.limit = 9;
    renderFilters();
    renderFilms();
    updateURL();
    $("#films").scrollIntoView();
  }
});
setLanguage(language, false);
loadRequest = loadGallery();
