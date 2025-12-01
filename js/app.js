/* APP MODULE
   Orquestra o Kanban:
   - carrega estado (localStorage ou dados iniciais)
   - responde ao drag & drop
   - cria / edita tarefas via modal
   - aplica filtros
   - salva no Storage
*/

const App = (function () {

  let boardState = null;
  let editingTaskInfo = null; // { id, columnId } ou null

  // filtros ativos
  let activeTagFilter = "all";
  let activePriorityFilter = "all";

  // referências do modal
  let modalBackdrop, modalTitle, taskForm,
      inputTitle, inputDescription,
      selectTag, selectPriority, selectColumn,
      cancelBtn;

  // filtros selects
  let filterTagSelect, filterPrioritySelect;

  const tagMap = {
    dev:   { label: "Dev",   class: "tag-dev" },
    bug:   { label: "Bug",   class: "tag-bug" },
    idea:  { label: "Idea",  class: "tag-idea" }
  };

  const priorityMap = {
    high:   { label: "Alta",  class: "high" },
    medium: { label: "Média", class: "medium" },
    low:    { label: "Baixa", class: "low" }
  };

  function init() {
    // pega elementos do modal
    modalBackdrop    = document.getElementById("taskModalBackdrop");
    modalTitle       = document.getElementById("taskModalTitle");
    taskForm         = document.getElementById("taskForm");
    inputTitle       = document.getElementById("taskTitle");
    inputDescription = document.getElementById("taskDescription");
    selectTag        = document.getElementById("taskTag");
    selectPriority   = document.getElementById("taskPriority");
    selectColumn     = document.getElementById("taskColumn");
    cancelBtn        = document.getElementById("cancelTaskBtn");

    // filtros
    filterTagSelect      = document.getElementById("filterTag");
    filterPrioritySelect = document.getElementById("filterPriority");

    // carrega estado
    boardState = Storage.load() || KanbanData.getInitialBoard();

    // inicializa Board com callbacks
    Board.init({
      onMoveTask: handleMoveTask,
      onCardClick: handleCardClick,
      onDeleteTask: handleDeleteTask
    });

    // botão "+ Nova tarefa"
    const addBtn = document.querySelector(".add-task-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => openModalCreate());
    }

    // eventos do modal
    if (taskForm) {
      taskForm.addEventListener("submit", onFormSubmit);
    }

    if (cancelBtn) {
      cancelBtn.addEventListener("click", closeModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
          closeModal();
        }
      });
    }

    // eventos dos filtros
    if (filterTagSelect) {
      filterTagSelect.addEventListener("change", () => {
        activeTagFilter = filterTagSelect.value;
        renderAndSave(false);
      });
    }

    if (filterPrioritySelect) {
      filterPrioritySelect.addEventListener("change", () => {
        activePriorityFilter = filterPrioritySelect.value;
        renderAndSave(false);
      });
    }

    // render inicial (sem salvar de novo)
    renderAndSave(false);

    console.log("Kanban inicializado.");
  }

  /* ========== MOVIMENTO (drag & drop) ========== */

  function handleMoveTask(taskId, targetColumnId) {
    taskId = parseInt(taskId, 10);

    let sourceColumn = null;
    let targetColumn = null;
    let movedTask = null;

    boardState.columns.forEach((col) => {
      if (col.id === targetColumnId) {
        targetColumn = col;
      }

      const idx = col.tasks.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        sourceColumn = col;
        movedTask = col.tasks.splice(idx, 1)[0];
      }
    });

    if (!movedTask || !targetColumn) return;

    targetColumn.tasks.push(movedTask);
    renderAndSave(true);
  }

  /* ========== EXCLUIR TAREFA ========== */

  function handleDeleteTask(taskId, columnId) {
    taskId = parseInt(taskId, 10);

    let col = boardState.columns.find((c) => c.id === columnId);
    if (!col) {
      // fallback
      boardState.columns.forEach((c) => {
        if (!col) {
          const idx = c.tasks.findIndex((t) => t.id === taskId);
          if (idx !== -1) col = c;
        }
      });
    }
    if (!col) return;

    const idx = col.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;

    const task = col.tasks[idx];

    const ok = confirm(`Excluir a tarefa "${task.title}"?`);
    if (!ok) return;

    col.tasks.splice(idx, 1);
    renderAndSave(true);
  }

  /* ========== CRIAR / EDITAR VIA MODAL ========== */

  function openModalCreate(defaultColumnId = "backlog") {
    editingTaskInfo = null;
    modalTitle.textContent = "Nova tarefa";

    if (inputTitle) inputTitle.value = "";
    if (inputDescription) inputDescription.value = "";
    if (selectTag) selectTag.value = "dev";
    if (selectPriority) selectPriority.value = "medium";

    fillColumnOptions(defaultColumnId);
    showModal();
  }

  function handleCardClick(taskId, columnId) {
    taskId = parseInt(taskId, 10);

    const col = boardState.columns.find((c) => c.id === columnId);
    if (!col) return;

    const task = col.tasks.find((t) => t.id === taskId);
    if (!task) return;

    editingTaskInfo = { id: taskId, columnId };

    modalTitle.textContent = "Editar tarefa";

    if (inputTitle) inputTitle.value = task.title;
    if (inputDescription) inputDescription.value = task.description || "";

    // tag
    let tagKey = "dev";
    if (task.tagClass === "tag-bug" || task.tag === "Bug") tagKey = "bug";
    else if (task.tagClass === "tag-idea" || task.tag === "Idea") tagKey = "idea";
    if (selectTag) selectTag.value = tagKey;

    // prioridade
    let prioKey = "medium";
    if (task.priorityClass === "high" || task.priority === "Alta") prioKey = "high";
    else if (task.priorityClass === "low" || task.priority === "Baixa") prioKey = "low";
    if (selectPriority) selectPriority.value = prioKey;

    fillColumnOptions(columnId);
    showModal();
  }

  function fillColumnOptions(selectedColumnId) {
    if (!selectColumn) return;

    selectColumn.innerHTML = "";
    boardState.columns.forEach((col) => {
      const opt = document.createElement("option");
      opt.value = col.id;
      opt.textContent = col.title;
      if (col.id === selectedColumnId) opt.selected = true;
      selectColumn.appendChild(opt);
    });
  }

  function showModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add("is-open");
    if (inputTitle) {
      setTimeout(() => inputTitle.focus(), 50);
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    editingTaskInfo = null;
    if (taskForm) taskForm.reset();
  }

  function onFormSubmit(e) {
    e.preventDefault();

    const title = (inputTitle?.value || "").trim();
    if (!title) return;

    const description = (inputDescription?.value || "").trim();
    const tagKey = selectTag?.value || "dev";
    const prioKey = selectPriority?.value || "medium";
    const columnId = selectColumn?.value || "backlog";

    const tagCfg = tagMap[tagKey] || tagMap.dev;
    const prioCfg = priorityMap[prioKey] || priorityMap.medium;

    // NOVA TAREFA
    if (!editingTaskInfo) {
      const newId = getNextId();
      const meta = `#${newId} • Agora`;

      const newTask = {
        id: newId,
        title,
        description,
        tag: tagCfg.label,
        tagClass: tagCfg.class,
        priority: prioCfg.label,
        priorityClass: prioCfg.class,
        meta,
        assignee: "AR"
      };

      let col = boardState.columns.find((c) => c.id === columnId);
      if (!col) col = boardState.columns[0];

      col.tasks.unshift(newTask);

      renderAndSave(true);
      closeModal();
      return;
    }

    // EDIÇÃO
    const { id: taskId, columnId: originalColumnId } = editingTaskInfo;

    let fromCol = boardState.columns.find((c) => c.id === originalColumnId);
    if (!fromCol) {
      boardState.columns.forEach((c) => {
        if (!fromCol) {
          const idx = c.tasks.findIndex((t) => t.id === taskId);
          if (idx !== -1) fromCol = c;
        }
      });
    }
    if (!fromCol) return;

    const idx = fromCol.tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) return;

    let task = fromCol.tasks[idx];

    let targetCol = boardState.columns.find((c) => c.id === columnId) || fromCol;
    if (targetCol.id !== fromCol.id) {
      fromCol.tasks.splice(idx, 1);
      targetCol.tasks.unshift(task);
    }

    task.title = title;
    task.description = description;
    task.tag = tagCfg.label;
    task.tagClass = tagCfg.class;
    task.priority = prioCfg.label;
    task.priorityClass = prioCfg.class;
    task.meta = `#${task.id} • Atualizado`;

    renderAndSave(true);
    closeModal();
  }

  /* ========== FILTROS ========== */

  function getFilteredBoard() {
    // clone profundo
    const clone = JSON.parse(JSON.stringify(boardState));

    clone.columns.forEach((col) => {
      col.tasks = col.tasks.filter((task) => {
        // filtro por tag
        if (activeTagFilter !== "all") {
          const expectedClass = `tag-${activeTagFilter}`;
          if (task.tagClass !== expectedClass) return false;
        }

        // filtro por prioridade
        if (activePriorityFilter !== "all") {
          if (task.priorityClass !== activePriorityFilter) return false;
        }

        return true;
      });
    });

    return clone;
  }

  /* ========== UTILITÁRIOS ========== */

  function getNextId() {
    let max = 0;
    boardState.columns.forEach((col) => {
      col.tasks.forEach((t) => {
        if (t.id > max) max = t.id;
      });
    });
    return max + 1;
  }

  function renderAndSave(shouldSave) {
    const toRender = getFilteredBoard();
    Board.render(toRender);
    if (shouldSave) {
      Storage.save(boardState);
    }
  }

  return {
    init
  };

})();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Theme !== "undefined" && Theme.init) {
    Theme.init();
  }
  if (typeof UI !== "undefined" && UI.init) {
    UI.init();
  }
  App.init();
});