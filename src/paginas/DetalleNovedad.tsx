import { useParams, Link } from 'react-router-dom';
import { novedadesIniciales } from '../datos/mockNovedades';

export const DetalleNovedad = () => {
  const { id } = useParams();
  const novedad = novedadesIniciales.find(n => n.id === id);

  if (!novedad) {
    return (
      <div className="text-center mt-5">
        <h3>Publicación no encontrada</h3>
        <Link to="/novedades" className="btn btn-primary mt-3">Volver a novedades</Link>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card border-0 shadow-sm overflow-hidden">
          <img src={novedad.imagen} className="card-img-top" alt={novedad.titulo} style={{ maxHeight: '400px', objectFit: 'cover' }} />
          <div className="card-body p-5">
            <h2 className="fw-bold text-primary mb-2">{novedad.titulo}</h2>
            <p className="text-muted mb-4">Publicado el {novedad.fecha}</p>
            <p className="lead" style={{ whiteSpace: 'pre-line' }}>{novedad.contenidoDetallado}</p>
            <hr className="my-4" />
            <Link to="/novedades" className="btn btn-secondary">← Volver al listado</Link>
          </div>
        </div>
      </div>
    </div>
  );
};