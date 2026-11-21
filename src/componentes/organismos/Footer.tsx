import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          
          {/* Columna 1: Identidad y Descripción */}
          <div className="col-12 col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold text-info mb-3">Veterinaria San Marcos</h5>
            <p className="small text-light text-opacity-75 pe-md-4">
              Comprometidos con el bienestar y la salud integral de tus mascotas. 
              Brindamos atención médica de excelencia con más de 10 años de experiencia clínica.
            </p>
          </div>

          {/* Columna 2: Enlaces de Navegación Rápidos */}
          <div className="col-12 col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold text-info mb-3">Portal Rápido</h5>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/" className="text-light text-opacity-75 text-decoration-none">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link to="/catalogo" className="text-light text-opacity-75 text-decoration-none">Catálogo de Servicios</Link>
              </li>
              <li className="mb-2">
                <Link to="/agendar" className="text-light text-opacity-75 text-decoration-none">Agendar Hora</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Horarios (Lo que más llena visualmente) */}
          <div className="col-12 col-md-4 mb-4">
            <h5 className="text-uppercase fw-bold text-info mb-3">Contacto y Horarios</h5>
            <ul className="list-unstyled small text-light text-opacity-75">
              <li className="mb-2">📍 Av. Los Leones 1234, Providencia</li>
              <li className="mb-2">📞 Mesa Central: +56 2 2345 6789</li>
              <li className="mb-3 text-warning">
                🚨 <strong>Urgencias 24/7: +56 9 9988 7766</strong>
              </li>
              <li className="mt-2">🕒 <strong>Lunes a Viernes:</strong> 09:00 - 20:00 hrs</li>
              <li>🕒 <strong>Sábados:</strong> 10:00 - 15:00 hrs</li>
            </ul>
          </div>

        </div>

        {/* Línea separadora */}
        <hr className="border-secondary mt-2 mb-3" />

        {/* Barra inferior: Copyright y Legales */}
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start small text-light text-opacity-50">
            &copy; {new Date().getFullYear()} Veterinaria San Marcos. Todos los derechos reservados.
          </div>
          <div className="col-md-6 text-center text-md-end small text-light text-opacity-50 mt-2 mt-md-0">
            <a href="#" className="text-light text-opacity-50 text-decoration-none me-3">Políticas de Privacidad</a>
            <a href="#" className="text-light text-opacity-50 text-decoration-none">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};