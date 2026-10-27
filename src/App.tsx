import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './componentes/organismos/Navbar';
import { Footer } from './componentes/organismos/Footer';
import { Inicio } from './paginas/Inicio';
import { Catalogo } from './paginas/Catalogo';
import { Novedades } from './paginas/Novedades';
import { DetalleNovedad } from './paginas/DetalleNovedad';
import { Nosotros } from './paginas/Nosotros';
import { Contacto } from './paginas/Contacto';
import { Login } from './paginas/Login';
import { Registro } from './paginas/Registro';
import { Admin } from './paginas/Admin';
import { MisReservas } from './paginas/MisReservas';
import { Servicios } from './paginas/Servicios';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BrowserRouter>
        <Navbar />
        {/* El contenido principal crece para empujar el footer hacia abajo */}
        <div className="container pb-5 flex-grow-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/novedades" element={<Novedades />} />
            <Route path="/novedades/:id" element={<DetalleNovedad />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reservas" element={<MisReservas />} />
            <Route path="/servicios" element={<Servicios />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;