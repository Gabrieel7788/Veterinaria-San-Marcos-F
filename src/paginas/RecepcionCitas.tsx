import { useCallback, useEffect, useState } from 'react';

interface Cita {
  id: number;
  duenoUsuarioId: number;
  mascotaId: number;
  servicio: string;
  motivo: string;
  fechaHora: string;
  fechaHoraPropuesta: string | null;
  estado: string;
  creadaEn: string;
}

const API = 'http://localhost:8082/api/citas';

export const RecepcionCitas = () => {

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<number | null>(null);

  const [error, setError] = useState('');
  const [errorCita, setErrorCita] = useState<{id: number; mensaje: string;} | null>(null);
  const [mensaje, setMensaje] = useState('');

  const [propuestaId, setPropuestaId] = useState<number | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState('');

  let rol = '';

  try {
    const usuario = JSON.parse(
      sessionStorage.getItem('usuarioVet') || 'null'
    );
    rol = usuario?.rol || '';
  } catch {
    rol = '';
  }

  const autorizado =
    rol === 'RECEPCIONISTA' || rol === 'ADMINISTRADOR';

  const cargarCitas = useCallback(async () => {
    const token = sessionStorage.getItem('tokenVet');

    if (!token) {
      setError('Debes iniciar sesión.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch(`${API}/recepcion`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : respuesta.status === 403
              ? 'No tienes permisos para gestionar citas.'
              : 'No se pudieron obtener las citas.'
        );
      }

      const datos: Cita[] = await respuesta.json();
      setCitas(datos);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al conectar con el backend.'
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (autorizado) {
      void cargarCitas();
    }
  }, [autorizado, cargarCitas]);

  const confirmarCita = async (id: number) => {
    const token = sessionStorage.getItem('tokenVet');
    if (!token || procesando !== null) return;

    if (!window.confirm('¿Confirmar esta cita veterinaria?')) {
      return;
    }

    setProcesando(id);
    setError('');
    setErrorCita(null);
    setMensaje('');

    try {
      const respuesta = await fetch(
        `${API}/${id}/confirmar`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 409
            ? 'Esta cita ya no está pendiente o el horario está ocupado.'
            : respuesta.status === 401
              ? 'Tu sesión venció. Vuelve a iniciar sesión.'
              : 'No se pudo confirmar la cita.'
        );
      }

      setMensaje(`Cita #${id} confirmada correctamente.`);
      await cargarCitas();


    } catch (err) {
      setErrorCita({
        id,
        mensaje: err instanceof Error
          ? err.message
          : 'Error inesperado.'
      });
    }
 finally {
      setProcesando(null);
    }
  };

  const proponerHorario = async (id: number) => {
    const token = sessionStorage.getItem('tokenVet');
    if (!token || procesando !== null) return;

    if (!nuevaFecha || new Date(nuevaFecha).getTime() <= Date.now()) {
      setError('Debes seleccionar una fecha y hora futura.');
      return;
    }

    setProcesando(id);
    setError('');
    setMensaje('');

    try {
      const respuesta = await fetch(
        `${API}/${id}/proponer-horario`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nuevaFechaHora: nuevaFecha
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 409
            ? 'No se puede proponer otro horario para esta cita.'
            : 'No se pudo enviar la propuesta.'
        );
      }

      setMensaje(
        `Nuevo horario propuesto para la cita #${id}.`
      );

      setPropuestaId(null);
      setNuevaFecha('');

      await cargarCitas();

    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error inesperado.'
      );
    } finally {
      setProcesando(null);
    }
  };

  const mostrarFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  const claseEstado = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-success';
      case 'PENDIENTE':
        return 'bg-warning text-dark';
      case 'PROPUESTA':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };

  if (!autorizado) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          No tienes permisos para acceder al panel de recepción.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h2 className="text-primary fw-bold mb-2">
        📅 Gestión de Citas
      </h2>

      <p className="text-muted mb-4">
        Panel de recepción - Veterinaria San Marcos
      </p>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success" role="status">
          {mensaje}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          Solicitudes recibidas ({citas.length})
        </h4>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => void cargarCitas()}
          disabled={cargando}
        >
          Actualizar
        </button>
      </div>

      {cargando && <p>Cargando citas...</p>}

      {!cargando && !error && citas.length === 0 && (
        <div className="alert alert-info">
          No existen solicitudes registradas.
        </div>
      )}

      {!cargando && citas.map(cita => (

        <div
          key={cita.id}
          className="card shadow-sm border-0 mb-3"
        >
          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

              <h5 className="fw-bold text-primary mb-0">
                Solicitud #{cita.id}
              </h5>

              <span className={`badge ${claseEstado(cita.estado)}`}>
                {cita.estado}
              </span>
            </div>

            <p className="mb-1">
              <strong>ID dueño:</strong> {cita.duenoUsuarioId}
            </p>

            <p className="mb-1">
              <strong>ID mascota:</strong> {cita.mascotaId}
            </p>

            <p className="mb-1">
              <strong>Servicio:</strong> {cita.servicio}
            </p>

            <p className="mb-1">
              <strong>Fecha solicitada:</strong>{' '}
              {mostrarFecha(cita.fechaHora)}
            </p>

            <p className="mb-3">
              <strong>Motivo:</strong> {cita.motivo}
            </p>

            {cita.fechaHoraPropuesta && (
              <div className="alert alert-info">
                <strong>Nuevo horario propuesto:</strong>{' '}
                {mostrarFecha(cita.fechaHoraPropuesta)}
              </div>
            )}


            {errorCita?.id === cita.id && (
              <div className="alert alert-warning mt-3" role="alert">
                ⚠️ {errorCita.mensaje}
              </div>
            )}

            {cita.estado === 'PENDIENTE' && (
              <div className="d-flex gap-2 flex-wrap mb-3">

                <button
                  className="btn btn-success"
                  disabled={procesando !== null}
                  onClick={() => void confirmarCita(cita.id)}
                >
                  Confirmar cita
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setPropuestaId(cita.id);
                    setNuevaFecha('');
                  }}
                >
                  Proponer otro horario
                </button>
              </div>
            )}

            {cita.estado === 'PROPUESTA' && (
              <button
                className="btn btn-outline-primary mb-3"
                onClick={() => {
                  setPropuestaId(cita.id);
                  setNuevaFecha('');
                }}
              >
                Cambiar propuesta
              </button>
            )}

            {propuestaId === cita.id && (
              <div className="border rounded p-3 bg-light">

                <label className="form-label fw-semibold">
                  Nueva fecha y hora
                </label>

                <input
                  type="datetime-local"
                  className="form-control mb-3"
                  value={nuevaFecha}
                  onChange={e => setNuevaFecha(e.target.value)}
                />

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary"
                    disabled={procesando !== null || !nuevaFecha}
                    onClick={() => void proponerHorario(cita.id)}
                  >
                    Enviar propuesta
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setPropuestaId(null);
                      setNuevaFecha('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      ))}

    </div>
  );
};
