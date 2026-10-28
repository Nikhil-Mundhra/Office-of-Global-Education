// Privacy-light analytics: anonymous, per-tab session id, no cookies, no IPs stored.
// Events are queued in the browser and sent in ONE request when the visitor leaves/hides the page.
(() => {
  if (navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return;

  const ENDPOINT = "/api/track";
  const queue = [];
  const sid =
    sessionStorage.getItem("oge_sid") ||
    (() => {
      const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { sessionStorage.setItem("oge_sid", id); } catch {}
      return id;
    })();
  const device = matchMedia("(max-width: 720px)").matches ? "mobile" : "desktop";

  const flush = () => {
    if (!queue.length) return;
    const payload = JSON.stringify({ sid, device, events: queue.splice(0, 25) });
    if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "text/plain" })))) {
      fetch(ENDPOINT, { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  };
  const track = (type, props = {}) => {
    queue.push({ type, ...props });
    if (queue.length >= 20) flush();
  };

  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
  addEventListener("pagehide", flush);

  // Page view (with any shared filter from the URL)
  const p = new URLSearchParams(location.search);
  track("view", { label: [p.get("topic"), p.get("q") && "q"].filter(Boolean).join(",") || undefined });

  // Topic filter
  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) return track("filter", { label: chip.dataset.topic || "all" });

    const copy = e.target.closest("[data-copy]");
    if (copy) return track("copy_email", { label: copy.dataset.copy });

    const mail = e.target.closest('a[href^="mailto:"]');
    if (mail) return track("email_click", { label: mail.getAttribute("href").slice(7) });

    const quick = e.target.closest(".quick-main");
    if (quick) return track("link_click", { label: quick.querySelector(".quick-title")?.textContent });
  });

  // Search: only after the visitor pauses typing; skip anything that looks like personal info
  let timer;
  document.getElementById("search")?.addEventListener("input", (e) => {
    clearTimeout(timer);
    const q = e.target.value.trim().toLowerCase();
    if (q.length < 2 || /@|\d{5,}/.test(q)) return;
    timer = setTimeout(() => track("search", { q, results: document.querySelectorAll("#teams .team").length }), 1500);
  });
})();
