import { useState } from 'react';

export const Agendar = () => {
  // 1. Estados del formulario
  const [datos, setDatos] = useState({
    dueno: '',
    mascota: '',
    servicio: '',
    fecha: '',
    motivo: ''
  });

  const [alerta, setAlerta] = useState({ tipo: '', mensaje: '' });

  // 2. Manejador de cambios en los inputs
  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

  // 3. Validación y envío
  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue

    // Validación de campos vacíos
    if (!datos.dueno.trim() || !datos.mascota.trim() || !datos.servicio || !datos.fecha) {
      setAlerta({ tipo: 'danger', mensaje: 'Por favor, completa todos los campos obligatorios antes de agendar.' });
      return;
    }

    // Aquí podrías importar tus funciones de `validaciones.ts` si necesitas reglas más estrictas (ej. largo del nombre).

    // Si todo está correcto, mostramos éxito
    setAlerta({ tipo: 'success', mensaje: `¡Hora agendada con éxito para ${datos.mascota}! Te esperamos.` });
    
    // Limpiamos el formulario
    setDatos({ dueno: '', mascota: '', servicio: '', fecha: '', motivo: '' });

    // Ocultar el mensaje después de 5 segundos (Toque pro)
    setTimeout(() => setAlerta({ tipo: '', mensaje: '' }), 5000);
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="display-6 fw-bold text-dark mb-2">Agendar Hora Médica</h2>
      <p className="text-muted mb-4">Completa los datos de tu mascota para reservar una atención en nuestra clínica.</p>

      <div className="row gap-4 gap-md-0">
        <div className="col-12 col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              
              {/* Alerta dinámica (Aparece solo si hay un mensaje) */}
              {alerta.mensaje && (
                <div className={`alert alert-${alerta.tipo} fw-bold`} role="alert">
                  {alerta.mensaje}
                </div>
              )}

              <form onSubmit={manejarEnvio}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombre del Dueño *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="dueno"
                      value={datos.dueno}
                      onChange={manejarCambio}
                      placeholder="Ej: Juan Pérez" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Nombre del Paciente *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="mascota"
                      value={datos.mascota}
                      onChange={manejarCambio}
                      placeholder="Ej: Firulais" 
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Servicio Requerido *</label>
                    <select 
                      className="form-select" 
                      name="servicio"
                      value={datos.servicio}
                      onChange={manejarCambio}
                    >
                      <option value="">Selecciona un servicio...</option>
                      <option value="Consulta General">Consulta General</option>
                      <option value="Vacunación">Vacunación</option>
                      <option value="Peluquería">Peluquería</option>
                      <option value="Exámenes">Exámenes de Laboratorio</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Fecha Preferida *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="fecha"
                      value={datos.fecha}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Motivo de la consulta (Opcional)</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    name="motivo"
                    value={datos.motivo}
                    onChange={manejarCambio}
                    placeholder="Describe brevemente el motivo de la visita..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold">
                  Confirmar Reserva
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Info de Urgencias - Sin cambios) */}
        <div className="col-12 col-md-4">
          <div className="card border-info bg-light h-100">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold text-info border-bottom pb-2">Información Importante</h5>
              
              <div className="mt-3">
                <p className="fw-semibold mb-1">🚨 ¿Es una emergencia?</p>
                <p className="small text-muted mb-3">
                  Llama inmediatamente a nuestro número de urgencias: <br/>
                  <strong className="text-danger fs-5">+56 9 9988 7766</strong>
                </p>
              </div>

              <div className="mt-4">
                <p className="fw-semibold mb-1">⏰ Horario Regular</p>
                <ul className="list-unstyled small text-muted">
                  <li>Lunes a Viernes: 09:00 - 20:00</li>
                  <li>Sábados: 10:00 - 15:00</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};