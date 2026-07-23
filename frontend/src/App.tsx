// src/app/App.tsx
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './app/AppLayout.tsx';

function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

export default App;