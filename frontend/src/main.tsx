import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { SelectedNodeProvider } from './context/SelectedNodeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SelectedNodeProvider>
          <App />
        </SelectedNodeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);