import { Routes, Route } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage.tsx';
import { ExplorerPage } from './pages/ExplorerPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explorer" element={<ExplorerPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;