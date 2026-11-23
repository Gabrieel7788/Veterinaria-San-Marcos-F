import { Link } from 'react-router-dom';
import { serviciosIniciales } from '../datos/mockCatalogo';

export const Catalogo = () => {

  let rol = '';

  try {
    if (sessionStorage.getItem('tokenVet')) {
      const usuario = JSON.parse(
        sessionStorage.getItem('usuarioVet') || 'null'
      );

      rol = usuario?.rol || '';
    }
  } catch {
    rol = '';
  }

  const esCliente = rol === 'DUENO_MASCOTA';
  const esInvitado = !rol;

  return (
    <div className="container py-4">

      <h2 className="mb-4 text-primary">
        Catálogo de Servicios
      </h2>

      <div className="row g-4">

        {serviciosIniciales.map(servicio => (

          <div
            className="col-12 col-md-6 col-lg-4"
            key={servicio.codigo}
          >
            <div className="card h-100 shadow-sm border-0 bg-light">

              <div className="card-body d-flex flex-column">

                <h5 className="card-title text-primary fw-bold">
                  {servicio.nombre}
                </h5>

                <h6 className="card-subtitle mb-3 text-muted">
                  {servicio.categoria} • {servicio.especie}
                </h6>

                <p className="card-text mb-2">
                  <strong>Duración:</strong>{' '}
                  {servicio.duracion}
                </p>

                <p className="card-text mb-4">
                  <strong>Precio referencial:</strong>{' '}
                  ${servicio.precio.toLocaleString('es-CL')}
                </p>

                {/* Solo clientes pueden agendar citas */}
                {esCliente && (
                  <Link
                    to="/citas"
                    className="btn btn-primary mt-auto"
                  >
                    📅 Agendar cita
                  </Link>
                )}

                {/* Invitados deben iniciar sesión */}
                {esInvitado && (
                  <Link
                    to="/login"
                    className="btn btn-outline-primary mt-auto"
                  >
                    Inicia sesión para agendar
                  </Link>
                )}

              </div>
            </div>
          </div>

        ))}

      </div>
    </div>
  );
};
