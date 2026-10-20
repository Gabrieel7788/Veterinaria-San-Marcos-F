import { useState } from 'react';
import { serviciosIniciales } from '../datos/mockCatalogo';
import type { Servicio } from '../tipos/catalogo';

export const Catalogo = () => {
  // Inicializamos el estado con nuestros datos Mock
  const [servicios] = useState<Servicio[]>(serviciosIniciales);

  return (
    <div>
      <h2 className="mb-4">Catálogo de Servicios</h2>
      <div className="row">
        {servicios.map((servicio) => (
          <div className="col-md-4 mb-4" key={servicio.codigo}>
            <div className="card h-100 shadow-sm border-0 bg-light">
              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{servicio.nombre}</h5>
                <h6 className="card-subtitle mb-3 text-muted">{servicio.categoria} • {servicio.especie}</h6>
                <p className="card-text mb-1">
                  <strong>⏱ Duración:</strong> {servicio.duracion}
                </p>
                <p className="card-text mb-2">
                  <strong>💰 Precio:</strong> ${servicio.precio.toLocaleString('es-CL')}
                </p>
                {servicio.observaciones && (
                  <div className="alert alert-warning py-1 px-2 mt-3 mb-0 small">
                    {servicio.observaciones}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};