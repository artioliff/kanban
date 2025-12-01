# Artioli Kanban Board

Um **Kanban minimalista e profissional**, inspirado em ferramentas como Notion e Trello, criado para compor o portfólio do Artioli como **Front-End Developer**.

O projeto foi desenvolvido em **HTML, CSS e JavaScript puro**, com foco em:

- Organização de código em módulos
- UX limpa e responsiva
- Boas práticas de arquitetura no front-end
- Uso de `localStorage` para persistência de dados

---

## ✨ Features

- 🧱 **3 colunas padrão**: Backlog, Em Progresso, Concluído  
- 🖱️ **Drag & Drop** de tarefas entre colunas  
- 💾 **Persistência local** com `localStorage` (o quadro permanece igual ao recarregar a página)  
- ➕ **Criação de tarefas** via modal (título, descrição, tag, prioridade, coluna)  
- ✏️ **Edição de tarefas** ao clicar no card  
- 🗑️ **Exclusão de tarefas** com confirmação  
- 🏷 **Tags de tipo** (Dev, Bug, Idea)  
- ⚠ **Prioridades** (Alta, Média, Baixa) com cores visuais  
- 🔎 **Filtros por Tag e Prioridade**  
- 🌗 **Tema Dark / Light** com toggle e armazenamento no `localStorage`  
- 📱 Layout **responsivo**, com sidebar móvel no modo compacto

---

## 🧱 Stack e Tecnologias

- **HTML5** – estrutura da página e do board  
- **CSS3** – layout, responsividade e temas (Dark / Light)  
- **JavaScript (ES6+)** – lógica do Kanban, drag & drop, filtros, modal, tema, persistência  
- **localStorage** – salvando o estado do board no navegador  

---

## 📂 Estrutura de Pastas

```bash
artioli-kanban/
  index.html

  /css
    kanban-dark.css
    kanban-light.css

  /js
    theme.js
    data.js
    storage.js
    board.js
    ui.js
    app.js

  /assets
    artioli-kanban-banner.svg
```

### Principais módulos

- **`data.js`** – dados iniciais do Kanban (colunas e tarefas de exemplo)  
- **`storage.js`** – funções para salvar e carregar o board do `localStorage`  
- **`board.js`** – renderização das colunas/cards e lógica de drag & drop  
- **`ui.js`** – comportamento da interface (sidebar mobile, botão hambúrguer, etc.)  
- **`app.js`** – orquestra tudo: estado global, modal, filtros, criação/edição/exclusão, integração com o Board  
- **`theme.js`** – controle do tema Dark/Light do Kanban  

---

## 🚀 Como rodar o projeto

1. Clone este repositório ou baixe os arquivos:

```bash
git clone https://github.com/<seu-usuario>/kanban.git
cd kanban
```

2. Abra o arquivo `index.html` diretamente no navegador  
   **ou** use um servidor simples (por exemplo, a extensão **Live Server** do VSCode).

3. Interaja com o Kanban:

- Arraste cards entre colunas  
- Clique em **“+ Nova tarefa”** para criar uma task  
- Clique em um card para editar  
- Use os filtros de **Tag** e **Prioridade**  
- Altere o tema entre **Dark** e **Light**  

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como parte do plano de estudos do Artioli para:

- Demonstrar domínio de **JavaScript sem framework**  
- Mostrar entendimento de **arquitetura de front-end** (módulos separados, estado, UI)  
- Construir um **projeto real de portfólio** com visual profissional e código organizado  

---

## 📸 Preview

Adicione o banner dentro da pasta `assets` e referencie no README:

```md
![Preview do Artioli Kanban Board](./assets/artioli-kanban-banner.svg)
```

---

## 📄 Licença

Você pode adaptar, estudar e usar este projeto como referência pedagógica ou de portfólio.

---

Feito com foco, café e código por **Artioli**. ☕💻
