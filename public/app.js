(() => {
  const { quickLinks, topics, teams, photos = {} } = window.OGE_DATA;

  const $ = (sel) => document.querySelector(sel);
  const searchEl = $("#search");
  const topicsEl = $("#topics");
  const quickEl = $("#quick");
  const teamsEl = $("#teams");
  const emptyEl = $("#empty");
  const countEl = $("#result-count");
  const toastEl = $("#toast");

  const ICONS = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    plane: '<path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4a2.1 2.1 0 0 1 3 3l-4 4 1 8L15 23l-2.5-7.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  };
  const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const norm = (s) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[“”"]/g, "");

  const highlight = (text, terms) => {
    let html = esc(text);
    if (!terms.length) return html;
    const pattern = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    return html.replace(new RegExp(`(${pattern})`, "gi"), "<mark>$1</mark>");
  };

  const initials = (name) =>
    name.replace(/[“”"]/g, "").split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  // State (synced to URL so links like ?topic=visa can be shared / put on a QR code)
  const params = new URLSearchParams(location.search);
  const state = {
    query: params.get("q") || "",
    topic: topics.some((t) => t.id === params.get("topic")) ? params.get("topic") : null,
  };
  searchEl.value = state.query;

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (state.query) p.set("q", state.query);
    if (state.topic) p.set("topic", state.topic);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  };

  // Quick links
  quickEl.innerHTML = quickLinks
    .map(
      (q) => `
      <div class="quick" data-accent="${q.accent}">
        <a class="quick-main" href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">
          <span class="quick-icon">${svg(q.icon)}</span>
          <span class="quick-body">
            <span class="quick-title">${esc(q.title)}</span>
            <span class="quick-sub">${esc(q.subtitle)}</span>
          </span>
          <span class="quick-arrow">${svg("arrow")}</span>
        </a>
        ${q.copyEmail ? `<button type="button" class="btn btn-ghost quick-copy" data-copy="${esc(q.copyEmail)}" aria-label="Copy ${esc(q.copyEmail)}">${svg("copy")}Copy email</button>` : ""}
      </div>`
    )
    .join("");

  // Topic chips
  const renderChips = () => {
    topicsEl.innerHTML =
      `<button type="button" class="chip" data-topic="" aria-pressed="${!state.topic}">All</button>` +
      topics
        .map((t) => `<button type="button" class="chip" data-topic="${t.id}" aria-pressed="${state.topic === t.id}">${esc(t.label)}</button>`)
        .join("");
  };

  topicsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const id = btn.dataset.topic || null;
    state.topic = state.topic === id ? null : id;
    renderChips();
    renderTeams();
    syncUrl();
  });

  // Teams
  const haystack = (t) => norm([t.name, t.email, ...t.helpsWith, ...t.members, ...t.topics.map((id) => topics.find((x) => x.id === id)?.label || "")].join(" "));

  const renderTeams = () => {
    const terms = norm(state.query).split(/\s+/).filter(Boolean);
    const list = teams.filter((t) => {
      if (state.topic && !t.topics.includes(state.topic)) return false;
      const h = haystack(t);
      return terms.every((term) => h.includes(term));
    });

    teamsEl.innerHTML = list
      .map(
        (t, i) => `
        <article class="team" data-accent="${t.accent}" style="animation-delay:${i * 30}ms">
          <div class="team-bar"></div>
          <div class="team-body">
            <h3 class="team-name">${highlight(t.name, terms)}</h3>
            <span class="label">Ask about</span>
            <ul class="helps">${t.helpsWith.map((h) => `<li>${highlight(h, terms)}</li>`).join("")}</ul>
            ${t.members.length ? `<span class="label">Team</span>` : ""}
            <div class="members"${t.members.length ? "" : " hidden"}>
              ${t.members.map((m) => `<span class="member"><span class="avatar" aria-hidden="${photos[m] ? "false" : "true"}">${esc(initials(m))}${photos[m] ? `<img src="${esc(photos[m])}" alt="" width="128" height="128" loading="lazy" decoding="async" onerror="this.remove()">` : ""}</span>${highlight(m, terms)}</span>`).join("")}
            </div>
          </div>
          <div class="team-foot">
            <span class="email" title="${esc(t.email)}">${highlight(t.email, terms)}</span>
            <button type="button" class="btn btn-ghost" data-copy="${esc(t.email)}" aria-label="Copy ${esc(t.email)}">${svg("copy")}Copy</button>
            <a class="btn btn-primary" href="mailto:${esc(t.email)}" aria-label="Email ${esc(t.name)}">${svg("mail")}Email</a>
          </div>
        </article>`
      )
      .join("");

    emptyEl.hidden = list.length > 0;
    countEl.textContent =
      list.length === teams.length ? `${teams.length} teams` : `${list.length} of ${teams.length} teams`;
  };

  // Copy to clipboard
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  };

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    const email = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = Object.assign(document.createElement("textarea"), { value: email });
      document.body.append(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    const label = btn.classList.contains("quick-copy") ? "Copy email" : "Copy";
    btn.innerHTML = `${svg("check")}Copied`;
    setTimeout(() => (btn.innerHTML = `${svg("copy")}${label}`), 1500);
    toast(`Copied ${email}`);
  });

  // Search
  searchEl.addEventListener("input", () => {
    state.query = searchEl.value.trim();
    renderTeams();
    syncUrl();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchEl && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      searchEl.focus();
    } else if (e.key === "Escape" && document.activeElement === searchEl) {
      searchEl.value = "";
      state.query = "";
      renderTeams();
      syncUrl();
    }
  });

  $("#reset").addEventListener("click", () => {
    state.query = "";
    state.topic = null;
    searchEl.value = "";
    renderChips();
    renderTeams();
    syncUrl();
    searchEl.focus();
  });

  renderChips();
  renderTeams();
})();
