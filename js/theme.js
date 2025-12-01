/* THEME MODULE
   Controla tema dark/light para o Kanban
*/

const Theme = (function () {
  const STORAGE_KEY = "kanban-theme";
  const link = document.getElementById("themeStylesheet");

  function applyTheme(theme) {
    if (theme !== "dark" && theme !== "light") {
      theme = "dark";
    }

    const href =
      theme === "dark" ? "css/kanban-dark.css" : "css/kanban-light.css";

    if (link) {
      link.setAttribute("href", href);
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }

  function init() {
    const buttons = document.querySelectorAll(".theme-btn");

    let saved = localStorage.getItem(STORAGE_KEY) || "dark";
    applyTheme(saved);

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme || "dark";
        applyTheme(theme);
      });
    });
  }

  return {
    init,
    setTheme: applyTheme
  };
})();