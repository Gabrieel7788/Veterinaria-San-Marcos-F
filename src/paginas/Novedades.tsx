import { Link } from 'react-router-dom';
import { novedadesIniciales } from '../datos/mockNovedades';

export const Novedades = () => {
  return (
    <div>
      <h2 className="mb-4 text-primary">Novedades y Consejos</h2>
      <div className="row">
        {novedadesIniciales.map((novedad) => (
          <div className="col-md-6 mb-4" key={novedad.id}>
            <div className="card h-100 shadow-sm border-0">
              <img src={novedad.imagen} className="card-img-top" alt={novedad.titulo} style={{ height: '250px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{novedad.titulo}</h5>
                <h6 className="text-muted mb-3">{novedad.fecha}</h6>
                <p className="card-text">{novedad.resumen}</p>
                <Link to={`/novedades/${novedad.id}`} className="btn btn-outline-primary mt-auto align-self-start">
                  Leer publicación completa
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};