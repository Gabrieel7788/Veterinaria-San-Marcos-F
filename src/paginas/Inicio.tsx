import { Link } from 'react-router-dom';

export const Inicio = () => {
  return (
    <div className="text-center mt-5">
      <h1 className="display-4 fw-bold">Bienvenido a Veterinaria San Marcos</h1>
      <p className="lead mt-3 text-muted">Cuidamos a tu mascota con el mejor equipo de profesionales.</p>
      <div className="mt-4">
        <Link to="/catalogo" className="btn btn-primary btn-lg me-3">Ver Servicios</Link>
        <Link to="/admin" className="btn btn-outline-secondary btn-lg">Acceso Administrativo</Link>
      </div>
    </div>
  );
};