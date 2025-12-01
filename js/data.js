/* KANBAN DATA
   Estado inicial do quadro (colunas e tarefas)
*/

const KanbanData = (function () {

  const initialBoard = {
    columns: [
      {
        id: "backlog",
        title: "Backlog",
        dotClass: "backlog",
        tasks: [
          {
            id: 1,
            title: "Criar estrutura inicial do Kanban",
            description: "Montar HTML e CSS base com 3 colunas e layout responsivo.",
            tag: "Dev",
            tagClass: "tag-dev",
            priority: "Alta",
            priorityClass: "high",
            meta: "#1 • Hoje",
            assignee: "AR"
          },
          {
            id: 2,
            title: "Planejar estados da tarefa",
            description: "Definir estrutura de dados para armazenar tarefas e colunas.",
            tag: "Idea",
            tagClass: "tag-idea",
            priority: "Média",
            priorityClass: "medium",
            meta: "#2 • Amanhã",
            assignee: "AR"
          },
          {
            id: 3,
            title: "Ajustar responsividade mobile",
            description: "Melhorar visual em telas menores e animações de hover.",
            tag: "Bug",
            tagClass: "tag-bug",
            priority: "Baixa",
            priorityClass: "low",
            meta: "#3 • Esta semana",
            assignee: "AR"
          }
        ]
      },
      {
        id: "doing",
        title: "Em Progresso",
        dotClass: "doing",
        tasks: [
          {
            id: 4,
            title: "Implementar drag & drop",
            description: "Permitir mover cards entre colunas com HTML5 Drag & Drop.",
            tag: "Dev",
            tagClass: "tag-dev",
            priority: "Alta",
            priorityClass: "high",
            meta: "#4 • Em andamento",
            assignee: "AR"
          },
          {
            id: 5,
            title: "Criar modal de edição",
            description: "Modal para editar título, descrição, tag e prioridade.",
            tag: "Dev",
            tagClass: "tag-dev",
            priority: "Média",
            priorityClass: "medium",
            meta: "#5 • Em andamento",
            assignee: "AR"
          }
        ]
      },
      {
        id: "done",
        title: "Concluído",
        dotClass: "done",
        tasks: [
          {
            id: 6,
            title: "Definir layout e paleta de cores",
            description: "Inspirar no Notion/Trello com tema dark minimalista.",
            tag: "Dev",
            tagClass: "tag-dev",
            priority: "Baixa",
            priorityClass: "low",
            meta: "#6 • Ontem",
            assignee: "AR"
          }
        ]
      }
    ]
  };

  // Retorna um clone para evitar mutar o original por acidente
  function getInitialBoard() {
    return JSON.parse(JSON.stringify(initialBoard));
  }

  return {
    getInitialBoard
  };
})();