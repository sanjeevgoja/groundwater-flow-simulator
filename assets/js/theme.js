/**
 * Shared light/dark theme toggle. Stamps data-theme on <html> so both the
 * page's own CSS and Chart.js re-renders (via the 'themechange' event) can
 * react to an explicit user choice, independent of the OS setting.
 */
(function () {
  const KEY = "soil-theme";
  const saved = localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") {
    document.documentElement.setAttribute("data-theme", saved);
  }

  function currentTheme() {
    const stamp = document.documentElement.getAttribute("data-theme");
    if (stamp) return stamp;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyToggleLabel(btn) {
    btn.textContent = currentTheme() === "dark" ? "☀️ Light mode" : "\u{1F319} Dark mode";
  }

  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    applyToggleLabel(btn);
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(KEY, next);
      applyToggleLabel(btn);
      window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    });
  });
})();
