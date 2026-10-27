import { Link } from "react-router-dom";

export const Servicios = () => {
  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center text-primary mb-4">Nuestros Servicios Veterinarios</h2>
      <p className="text-center text-muted mb-5">
        Cuidamos a tu mascota con el mejor equipo médico y tecnología de punta.
      </p>

      <div className="row g-4">
        {/* Tarjeta 1 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h4 className="card-title">🩺 Consulta General</h4>
              <p className="card-text mt-3">
                Revisión completa de tu mascota para prevenir y diagnosticar enfermedades a tiempo.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h4 className="card-title">💉 Vacunación</h4>
              <p className="card-text mt-3">
                Esquemas de vacunación completos para cachorros y adultos. Protege a tu mejor amigo.
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="col-12 col-md-4">
          <div className="card h-100 shadow-sm border-0 bg-light">
            <div className="card-body text-center">
              <h4 className="card-title">✂️ Peluquería</h4>
              <p className="card-text mt-3">
                Baño, corte de pelo y limpieza de oídos para que tu mascota luzca y se sienta increíble.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/contacto" className="btn btn-primary me-3">Agendar Hora</Link>
        <Link to="/" className="btn btn-outline-secondary">Volver al Inicio</Link>
      </div>
    </div>
  );
};