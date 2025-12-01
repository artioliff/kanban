/* UI MODULE
   Controle da sidebar mobile no Kanban
*/

const UI = (function () {

  function init() {
    const toggleBtn = document.getElementById("sidebarToggle");
    const sidebar = document.querySelector(".sidebar");

    if (!toggleBtn || !sidebar) return;

    // Abre/fecha ao clicar no botão ☰
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.classList.toggle("sidebar-open");
    });

    // Fecha ao clicar fora da sidebar (overlay)
    document.addEventListener("click", (e) => {
      const clickedOutside =
        !e.target.closest(".sidebar") &&
        !e.target.closest("#sidebarToggle");

      if (document.body.classList.contains("sidebar-open") && clickedOutside) {
        document.body.classList.remove("sidebar-open");
      }
    });

    // Fecha ao clicar em um item de menu da sidebar
    document.querySelectorAll(".sidebar .nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        document.body.classList.remove("sidebar-open");
      });
    });
  }

  return {
    init
  };

})();