// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import CrearGrupo from './pages/CrearGrupo';
import Grupo from './pages/Grupo';
import Ranking from './pages/Ranking';
import Resultados from './pages/Resultados';
import El404 from './pages/El404';
import './App.css';

function App() {
  return (
    <div className="body-fondo">
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/crearGrupo" element={<CrearGrupo />} />
        <Route path="/grupo/:codigo" element={<Grupo />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/resultados/:codigo" element={<Resultados />} />
        <Route path="*" element={<El404 />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;