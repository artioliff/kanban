/* BOARD MODULE
   Renderiza colunas e cards do Kanban + Drag & Drop
   Não mexe no estado, só avisa o App via callbacks.
*/

const Board = (function () {

  const boardEl = document.getElementById("board");

  let draggedTaskId = null;
  let onMoveTask = null;
  let onCardClick = null;
  let onDeleteTask = null;

  function init(callbacks) {
    onMoveTask = callbacks && typeof callbacks.onMoveTask === "function"
      ? callbacks.onMoveTask
      : null;

    onCardClick = callbacks && typeof callbacks.onCardClick === "function"
      ? callbacks.onCardClick
      : null;

    onDeleteTask = callbacks && typeof callbacks.onDeleteTask === "function"
      ? callbacks.onDeleteTask
      : null;
  }

  function render(board) {
    if (!boardEl) return;

    boardEl.innerHTML = "";

    board.columns.forEach((column) => {
      const columnEl = document.createElement("article");
      columnEl.className = "column";
      columnEl.dataset.columnId = column.id;

      const count = column.tasks.length;

      columnEl.innerHTML = `
        <header class="column-header">
          <div style="display:flex; align-items:center; gap:.35rem;">
            <span class="column-dot ${column.dotClass}"></span>
            <h2 class="column-title">${column.title}</h2>
          </div>
          <span class="column-count">${count}</span>
        </header>
        <div class="column-body"></div>
      `;

      const bodyEl = columnEl.querySelector(".column-body");

      column.tasks.forEach((task) => {
        const cardEl = createCard(task, column.id);
        bodyEl.appendChild(cardEl);
      });

      boardEl.appendChild(columnEl);
    });

    attachDragAndDrop();
  }

  function createCard(task, columnId) {
    const cardEl = document.createElement("div");
    cardEl.className = "card";
    cardEl.dataset.taskId = task.id;
    cardEl.dataset.columnId = columnId;
    cardEl.draggable = true;

    cardEl.innerHTML = `
      <div class="card-header">
        <div class="card-header-left">
          <span class="card-tag ${task.tagClass}">${task.tag}</span>
          <span class="card-priority ${task.priorityClass}">${task.priority}</span>
        </div>
        <button class="card-delete-btn" title="Excluir tarefa">×</button>
      </div>
      <h3 class="card-title">${task.title}</h3>
      <p class="card-description">
        ${task.description}
      </p>
      <div class="card-footer">
        <span class="card-meta">${task.meta}</span>
        <span class="card-assignee">${task.assignee}</span>
      </div>
    `;

    // clique para editar
    if (onCardClick) {
      cardEl.addEventListener("click", () => {
        onCardClick(task.id, columnId);
      });
    }

    // excluir
    const deleteBtn = cardEl.querySelector(".card-delete-btn");
    if (deleteBtn && onDeleteTask) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // não abre modal
        onDeleteTask(task.id, columnId);
      });
    }

    return cardEl;
  }

  /* ============ DRAG & DROP ============ */

  function attachDragAndDrop() {
    const cards = boardEl.querySelectorAll(".card");
    const columns = boardEl.querySelectorAll(".column");

    cards.forEach((card) => {
      card.addEventListener("dragstart", onDragStart);
      card.addEventListener("dragend", onDragEnd);
    });

    columns.forEach((col) => {
      col.addEventListener("dragover", onDragOver);
      col.addEventListener("drop", onDrop);
      col.addEventListener("dragenter", onDragEnter);
      col.addEventListener("dragleave", onDragLeave);
    });
  }

  function onDragStart(e) {
    const card = e.currentTarget;
    draggedTaskId = parseInt(card.dataset.taskId, 10);
    card.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragEnd(e) {
    const card = e.currentTarget;
    card.classList.remove("is-dragging");
    draggedTaskId = null;
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDragEnter(e) {
    e.preventDefault();
    const column = e.currentTarget;
    const body = column.querySelector(".column-body");
    body.classList.add("drop-target");
  }

  function onDragLeave(e) {
    const column = e.currentTarget;
    const body = column.querySelector(".column-body");
    body.classList.remove("drop-target");
  }

  function onDrop(e) {
    e.preventDefault();

    const column = e.currentTarget;
    const body = column.querySelector(".column-body");
    body.classList.remove("drop-target");

    if (draggedTaskId == null || !onMoveTask) return;

    const targetColumnId = column.dataset.columnId;
    onMoveTask(draggedTaskId, targetColumnId);
  }

  return {
    init,
    render
  };

})();