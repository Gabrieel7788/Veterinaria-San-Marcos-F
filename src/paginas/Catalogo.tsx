import { useState } from 'react';
import { serviciosIniciales } from '../datos/mockCatalogo';
import type { Servicio } from '../tipos/catalogo';
import { Boton } from '../componentes/atomos/Boton';

export const Catalogo = () => {
  const [servicios] = useState<Servicio[]>(serviciosIniciales);

  const agregarAReservas = (servicio: Servicio) => {
    // 1. Leer el LocalStorage (si no hay nada, devuelve un arreglo vacío)
    const reservasGuardadas = JSON.parse(localStorage.getItem('reservasVet') || '[]');
    
    // 2. Agregar el nuevo servicio
    const nuevasReservas = [...reservasGuardadas, servicio];
    
    // 3. Guardar nuevamente en LocalStorage como string
    localStorage.setItem('reservasVet', JSON.stringify(nuevasReservas));
    
    alert(`¡${servicio.nombre} agregado a tus reservas!`);
  };

  return (
    <div>
      <h2 className="mb-4 text-primary">Catálogo de Servicios</h2>
      <div className="row">
        {servicios.map((servicio) => (
          <div className="col-md-4 mb-4" key={servicio.codigo}>
            <div className="card h-100 shadow-sm border-0 bg-light">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary fw-bold">{servicio.nombre}</h5>
                <h6 className="card-subtitle mb-3 text-muted">{servicio.categoria} • {servicio.especie}</h6>
                <p className="card-text mb-1"><strong>⏱ Duración:</strong> {servicio.duracion}</p>
                <p className="card-text mb-3"><strong>💰 Precio:</strong> ${servicio.precio.toLocaleString('es-CL')}</p>
                
                {/* Botón para agregar al LocalStorage que se empuja al fondo */}
                <Boton 
                  texto="Agregar a Reservas" 
                  variante="success" 
                  className="mt-auto w-100" 
                  onClick={() => agregarAReservas(servicio)} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};