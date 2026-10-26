import { Link } from 'react-router-dom';
import { serviciosIniciales } from '../datos/mockCatalogo';
import imagenInicio from '../assets/perrofeliz.jpg';
export const Inicio = () => {
  // Tomamos solo los 3 primeros servicios para destacarlos
  const serviciosDestacados = serviciosIniciales.slice(0, 3);

  return (
    <div>
      {/* Sección Hero (Presentación) */}
      <div className="row align-items-center mb-5 bg-light rounded shadow-sm p-4">
        <div className="col-md-6 text-center text-md-start">
          <h1 className="display-4 fw-bold text-dark">Bienvenido a Veterinaria San Marcos</h1>
          <p className="lead mt-3 text-muted">
            Cuidamos a tu mascota con el mejor equipo de profesionales. Descubre nuestros servicios y agenda tu visita.
          </p>
          <div className="mt-4">
            <Link to="/catalogo" className="btn btn-primary btn-lg me-3">Ver Todos los Servicios</Link>
          </div>
        </div>
        <div className="col-md-6 mt-4 mt-md-0">
          <img 
            src={imagenInicio} 
            alt="Perro feliz en veterinaria" 
            className="img-fluid rounded shadow"
          />
        </div>
      </div>

      {/* Sección Elementos Destacados */}
      <h3 className="text-primary fw-bold text-center mb-4">Servicios Destacados</h3>
      <div className="row">
        {serviciosDestacados.map((servicio) => (
          <div className="col-md-4 mb-4" key={servicio.codigo}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title fw-bold text-dark">{servicio.nombre}</h5>
                <p className="text-muted mb-2">{servicio.categoria}</p>
                <h4 className="text-success fw-bold mb-3">${servicio.precio.toLocaleString('es-CL')}</h4>
                <Link to="/catalogo" className="btn btn-outline-primary btn-sm">Ver detalles</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};