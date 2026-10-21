import { useState, useEffect } from 'react';
import { Boton } from '../componentes/atomos/Boton';
import type { Servicio } from '../tipos/catalogo';
import { Link } from 'react-router-dom';

export const MisReservas = () => {
  const [reservas, setReservas] = useState<Servicio[]>([]);

  // Cargar desde LocalStorage al montar el componente
  useEffect(() => {
    try {
      const guardadas = JSON.parse(localStorage.getItem('reservasVet') || '[]');
      setReservas(guardadas);
    } catch (error) {
      setReservas([]);
    }
  }, []);

  const eliminarReserva = (indexAEliminar: number) => {
    const nuevasReservas = reservas.filter((_, index) => index !== indexAEliminar);
    setReservas(nuevasReservas);
    localStorage.setItem('reservasVet', JSON.stringify(nuevasReservas));
  };

  const vaciarReservas = () => {
    setReservas([]);
    localStorage.removeItem('reservasVet');
  };

  const total = reservas.reduce((suma, servicio) => suma + servicio.precio, 0);

  // Vista cuando no hay reservas
  if (reservas.length === 0) {
    return (
      <div className="text-center mt-5 p-5 bg-light rounded shadow-sm border-0">
        <h2 className="text-muted mb-3">🛒 Tu lista de reservas está vacía</h2>
        <p className="lead mb-4">Aún no has agregado ningún servicio para tu mascota.</p>
        <Link to="/catalogo" className="btn btn-primary btn-lg">Explorar Catálogo</Link>
      </div>
    );
  }

  // Vista cuando sí hay reservas
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary mb-0">Mis Reservas</h2>
          <Boton texto="Vaciar Lista" variante="danger" onClick={vaciarReservas} />
        </div>

        <ul className="list-group mb-4 shadow-sm">
          {reservas.map((servicio, index) => (
            <li className="list-group-item d-flex justify-content-between align-items-center py-3" key={index}>
              <div>
                <h6 className="mb-0 fw-bold">{servicio.nombre}</h6>
                <small className="text-muted">{servicio.categoria} | {servicio.duracion}</small>
              </div>
              <div className="d-flex align-items-center">
                <span className="badge bg-primary rounded-pill fs-6 me-3">
                  ${servicio.precio.toLocaleString('es-CL')}
                </span>
                <Boton texto="X" variante="outline-danger" className="btn-sm" onClick={() => eliminarReserva(index)} />
              </div>
            </li>
          ))}
        </ul>

        <div className="card border-0 bg-light shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Total a Pagar:</h4>
            <h3 className="mb-0 text-success fw-bold">${total.toLocaleString('es-CL')}</h3>
          </div>
        </div>
        
        <div className="text-end mt-4">
          <Boton texto="Confirmar y Pagar" variante="success" className="btn-lg" onClick={() => alert('Simulación de pago exitosa')} />
        </div>
      </div>
    </div>
  );
};