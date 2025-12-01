/* STORAGE MODULE
   Salva e carrega o board do localStorage
*/

const Storage = (function () {
  const KEY = "artioli-kanban-board";

  function save(board) {
    try {
      localStorage.setItem(KEY, JSON.stringify(board));
    } catch (err) {
      console.warn("[Storage] Erro ao salvar board:", err);
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn("[Storage] Erro ao carregar board, limpando storage:", err);
      localStorage.removeItem(KEY);
      return null;
    }
  }

  return {
    save,
    load
  };
})();