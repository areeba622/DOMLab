# DOMLab

DOMLab is a browser-based DOM visualizer built with React and TypeScript .Paste any HTML and DOMLab turns it into an explorable tree, synced live with a real rendered preview — click a node in either view to highlight it in the other. A built-in console flags common HTML issues as you go.

<img width="958" height="473" alt="image" src="https://github.com/user-attachments/assets/e0a24ed7-f974-4bdd-a43e-ee1db8fe4bc3" />

## What DOMLab Does

- Renders a sample DOM tree in a hierarchical explorer view
- Synchronizes selected nodes across the DOM tree, inspector panel, and HTML preview
- Parse Html option where users can bring their own HTML and explore its real DOM structure


## Project Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later

### Getting started

```bash
cd frontend
npm install
npm run dev
```

Open the local dev server URL shown in the terminal to view the app.

### Build for production

```bash
cd frontend
npm run build
```

### Preview the production build

```bash
cd frontend
npm run preview
```

## Tech Stack

- React 19
- TypeScript 6
- Vite
- Tailwind CSS 4
- Framer Motion
- React Router DOM
- ESLint

## Folder Structure

```text
DOMLab/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── AppLayout.tsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── canvas/
│   │   │   │   └── LivePreview.tsx
│   │   │   ├── console/
│   │   │   │   ├── Console.tsx
│   │   │   │   └── console.types.ts
│   │   │   ├── dom-tree/
│   │   │   │   ├── DomTree.tsx
│   │   │   │   ├── DomTreeNode.tsx
│   │   │   │   ├── DomTreePanel.tsx
│   │   │   │   └── DomTreeToolbar.tsx
│   │   │   ├── input/
│   │   │   │   └── HtmlInputPanel.tsx
│   │   │   ├── inspector/
│   │   │   │   ├── Inspector.tsx
│   │   │   │   └── InspectorField.tsx
│   │   │   └── layout/
│   │   │       ├── ComingSoon.tsx
│   │   │       ├── MobileNav.tsx
│   │   │       ├── Navbar.tsx
│   │   │       ├── Panel.tsx
│   │   │       ├── StatusBar.tsx
│   │   │       └── ThemeToggle.tsx
│   │   ├── components.tsx
│   │   ├── context/
│   │   │   ├── SelectedNodeContext.tsx
│   │   │   ├── selection.types.ts
│   │   │   ├── theme.types.ts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useDomTree.ts
│   │   │   ├── useDomTree.types.ts
│   │   │   ├── useParsedDom.ts
│   │   │   └── useParsedDom.types.ts
│   │   ├── lib/
│   │   │   └── animations.ts
│   │   ├── pages/
│   │   │   ├── ExplorerPage.tsx
│   │   │   └── LandingPage.tsx
│   │   ├── types/
│   │   │   └── dom.types.ts
│   │   ├── utils/
│   │   │   ├── analyzeDom.ts
│   │   │   ├── domParser.ts
│   │   │   └── renderHtml.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── eslint.config.js
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

## Important Notes

- The repository is currently scoped around the `frontend` app.
- The app is designed for visualizing DOM structure and node selection flows.
- The live demo section is meant to illustrate DOM node selection, HTML rendering, and inspector sync.

## Coming Soon

- JavaScript-driven manipulation
- Editable DOM node content and inline HTML editing
- Save/load DOM tree snapshots
- More advanced inspector details for node attributes and styles
- Search, filter, and keyboard navigation for the DOM tree



## License

This project is licensed under the [Unlicense](LICENSE) - see the LICENSE.md file for details. This means the code is dedicated to the public domain and you can do whatever you want with it.

