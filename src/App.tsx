import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './componentes/organismos/Navbar';
import { Inicio } from './paginas/Inicio';
import { Catalogo } from './paginas/Catalogo';
import { Admin } from './paginas/Admin';
import { Login } from './paginas/Login';
import { Registro } from './paginas/Registro';
import { Nosotros } from './paginas/Nosotros';
import { Contacto } from './paginas/Contacto';
import { Novedades } from './paginas/Novedades';
import { DetalleNovedad } from './paginas/DetalleNovedad';
import { MisReservas } from './paginas/MisReservas';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container pb-5">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/novedades/:id" element={<DetalleNovedad />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;