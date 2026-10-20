import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './componentes/organismos/Navbar';
import { Inicio } from './paginas/Inicio';
import { Catalogo } from './paginas/Catalogo';
import { Admin } from './paginas/Admin';
// Importaremos Admin en el próximo paso

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;