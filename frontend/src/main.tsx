// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { SelectedNodeProvider } from './context/SelectedNodeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SelectedNodeProvider>
        <App />
      </SelectedNodeProvider>
    </ThemeProvider>
  </StrictMode>
);