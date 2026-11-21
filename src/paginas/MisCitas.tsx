import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
}

interface Cita {
  id: number;
  mascotaId: number;
  servicio: string;
  motivo: string;
  fechaHora: string;
  fechaHoraPropuesta: string | null;
  estado: string;
}

const API_MASCOTAS = 'http://localhost:8081/api/mascotas';
const API_CITAS = 'http://localhost:8082/api/citas';

export const MisCitas = () => {

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);

  const [mascotaId, setMascotaId] = useState('');
  const [servicio, setServicio] = useState('');
  const [motivo, setMotivo] = useState('');
  const [fechaHora, setFechaHora] = useState('');

  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  const [avisoCancelacion, setAvisoCancelacion] = useState<{
    id: number;
    texto: string;
    error: boolean;
  } | null>(null);

  const [recargaHorarios, setRecargaHorarios] = useState(0);

  const token = sessionStorage.getItem('tokenVet');

  const obtenerDatos = async () => {
    if (!token) {
      setError('Debes iniciar sesión.');
      setCargando(false);
      return;
    }

    setCargando(true);
    setError('');

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [respuestaMascotas, respuestaCitas] =
        await Promise.all([
          fetch(`${API_MASCOTAS}/mias`, { headers }),
          fetch(`${API_CITAS}/mias`, { headers })
        ]);

      if (!respuestaMascotas.ok || !respuestaCitas.ok) {
        const sesionVencida =
          respuestaMascotas.status === 401 ||
          respuestaCitas.status === 401;

        throw new Error(
          sesionVencida
            ? 'Tu sesión venció. Cierra sesión y vuelve a ingresar.'
            : 'No se pudieron cargar los datos.'
        );
      }

      setMascotas(await respuestaMascotas.json());
      setCitas(await respuestaCitas.json());

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al conectar con el servidor.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void obtenerDatos();
  }, []);

  useEffect(() => {
    if (!fechaSeleccionada || !token) {
      setHorariosDisponibles([]);
      setErrorHorarios('');
      setCargandoHorarios(false);
      return;
    }

    const controller = new AbortController();

    const cargarHorarios = async () => {
      setCargandoHorarios(true);
      setErrorHorarios('');
      setHorariosDisponibles([]);

      try {
        const respuesta = await fetch(
          `${API_CITAS}/horarios-disponibles?fecha=${fechaSeleccionada}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        if (!respuesta.ok) {
          throw new Error(
            respuesta.status === 401
              ? 'Tu sesión venció. Vuelve a iniciar sesión.'
              : 'No se pudieron consultar los horarios.'
          );
        }

        const horarios: string[] = await respuesta.json();

        if (!controller.signal.aborted) {
          setHorariosDisponibles(horarios);
        }

      } catch (err) {
        if (controller.signal.aborted) return;

        setErrorHorarios(
          err instanceof Error
            ? err.message
            : 'Error al consultar los horarios.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setCargandoHorarios(false);
        }
      }
    };

    void cargarHorarios();

    return () => controller.abort();

  }, [fechaSeleccionada, token, recargaHorarios]);


  const solicitarCita = async (e: FormEvent) => {
    e.preventDefault();

    if (guardando || !token) return;

    setError('');
    setMensaje('');

    if (new Date(fechaHora).getTime() <= Date.now()) {
      setError('Debes seleccionar una fecha futura.');
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(API_CITAS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          mascotaId: Number(mascotaId),
          servicio,
          motivo,
          fechaHora
        })
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : respuesta.status === 409
            ? 'Ese horario ya está ocupado. Selecciona otro.'
            : respuesta.status === 400
              ? 'Comprueba la mascota, fecha y datos de la cita.'
              : 'No se pudo registrar la cita.'
        );
      }

      setMensaje(
        '¡Solicitud enviada correctamente! Tu cita está pendiente de confirmación.'
      );

      setMascotaId('');
      setServicio('');
      setMotivo('');
      setFechaHora('');
      setFechaSeleccionada('');

      await obtenerDatos();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al solicitar la cita.'
      );
    } finally {
      setGuardando(false);
    }
  };


const aceptarPropuesta = async (id: number) => {
  if (!token) return;

  setError('');
  setMensaje('');

  try {
    const respuesta = await fetch(
      `${API_CITAS}/${id}/aceptar-propuesta`,
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
          ? 'Esta cita ya no tiene una propuesta pendiente.'
          : 'No se pudo aceptar el horario propuesto.'
      );
    }

    setMensaje('¡Nuevo horario aceptado! Tu cita está confirmada.');

    await obtenerDatos();

  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Error al aceptar el horario.'
    );
  }
};


const cancelarCita = async (id: number) => {

  if (!token || cancelandoId !== null) return;

  const confirmar = window.confirm(
    `¿Seguro que deseas cancelar la solicitud #${id}?`
  );

  if (!confirmar) return;

  setCancelandoId(id);
  setAvisoCancelacion(null);

  try {
    const respuesta = await fetch(
      `${API_CITAS}/${id}/cancelar`,
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
          ? 'Esta solicitud ya no se puede cancelar.'
          : respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : 'No se pudo cancelar la solicitud.'
      );
    }

    await obtenerDatos();

    setFechaHora('');
    setRecargaHorarios(valor => valor + 1);

    setAvisoCancelacion({
      id,
      texto: 'Solicitud cancelada correctamente.',
      error: false
    });

  } catch (err) {
    setAvisoCancelacion({
      id,
      texto: err instanceof Error
        ? err.message
        : 'Ocurrió un error inesperado.',
      error: true
    });

  } finally {
    setCancelandoId(null);
  }
};


  const nombreMascota = (id: number) => {
    return mascotas.find(m => m.id === id)?.nombre
      || `Mascota #${id}`;
  };

  const mostrarFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  if (!token) {
    return (
      <div className="container py-5 text-center">
        <h3>Debes iniciar sesión</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Ingresar
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <h2 className="text-primary text-center fw-bold mb-3">
        📅 Mis Citas Veterinarias
      </h2>

      <p className="text-center text-muted mb-5">
        Solicita una hora para tu mascota y consulta
        el estado de tus citas.
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="alert alert-success">
          {mensaje}
        </div>
      )}

      <div className="row g-4">

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="mb-4">Solicitar cita</h4>

              <form onSubmit={solicitarCita}>

                <div className="mb-3">
                  <label className="form-label">
                    Selecciona tu mascota
                  </label>

                  <select
                    className="form-select"
                    value={mascotaId}
                    onChange={e => setMascotaId(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar mascota</option>

                    {mascotas.map(mascota => (
                      <option key={mascota.id} value={mascota.id}>
                        {mascota.nombre} - {mascota.especie}
                      </option>
                    ))}

                  </select>

                  {mascotas.length === 0 && !cargando && (
                    <p className="text-muted mt-2">
                      Primero debes registrar una mascota.
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Servicio veterinario
                  </label>

                  <select
                    className="form-select"
                    value={servicio}
                    onChange={e => setServicio(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar servicio</option>
                    <option value="Consulta general">
                      Consulta general
                    </option>
                    <option value="Vacunación">
                      Vacunación
                    </option>
                    <option value="Desparasitación">
                      Desparasitación
                    </option>
                    <option value="Control de peso">
                      Control de peso
                    </option>
                    <option value="Cirugía menor">
                      Cirugía menor
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Fecha de atención
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    value={fechaSeleccionada}
                    min={(() => {
                      const hoy = new Date();
                      const anio = hoy.getFullYear();
                      const mes = String(hoy.getMonth() + 1).padStart(2, '0');
                      const dia = String(hoy.getDate()).padStart(2, '0');
                      return `${anio}-${mes}-${dia}`;
                    })()}
                    onChange={e => {
                      setFechaSeleccionada(e.target.value);
                      setFechaHora('');
                    }}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Horario disponible
                  </label>

                  <select
                    className="form-select"
                    value={fechaHora}
                    onChange={e => setFechaHora(e.target.value)}
                    disabled={
                      !fechaSeleccionada ||
                      cargandoHorarios ||
                      horariosDisponibles.length === 0
                    }
                    required
                  >
                    <option value="">
                      {cargandoHorarios
                        ? 'Buscando horarios...'
                        : 'Seleccionar horario'}
                    </option>

                    {horariosDisponibles.map(horario => (
                      <option key={horario} value={horario}>
                        {new Date(horario).toLocaleTimeString('es-CL', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </option>
                    ))}
                  </select>

                  {errorHorarios && (
                    <div className="alert alert-danger mt-2">
                      {errorHorarios}
                    </div>
                  )}

                  {fechaSeleccionada &&
                    !cargandoHorarios &&
                    !errorHorarios &&
                    horariosDisponibles.length === 0 && (
                      <p className="text-danger mt-2">
                        No hay horarios disponibles para esta fecha.
                        Selecciona otro día.
                      </p>
                    )}
                </div>


                <div className="mb-3">
                  <label className="form-label">
                    Motivo de consulta
                  </label>

                  <textarea
                    className="form-control"
                    rows={3}
                    maxLength={500}
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                    placeholder="Describe el motivo de la consulta"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={
                    guardando || cargando ||
                    mascotas.length === 0
                  }
                >
                  {guardando
                    ? 'Enviando solicitud...'
                    : 'Solicitar cita'}
                </button>

              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">

          <h4 className="mb-3">Mis solicitudes</h4>

          {cargando && (
            <p>Cargando citas...</p>
          )}

          {!cargando && !error && citas.length === 0 && (
            <div className="alert alert-info">
              Todavía no tienes citas registradas.
            </div>
          )}

          {citas.map(cita => (
            <div
              key={cita.id}
              className="card shadow-sm border-0 mb-3"
            >
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-primary fw-bold">
                    {nombreMascota(cita.mascotaId)}
                  </h5>

                  <span className={
                    cita.estado === 'CONFIRMADA'
                      ? 'badge bg-success'
                      : cita.estado === 'PENDIENTE'
                        ? 'badge bg-warning text-dark'
                        : 'badge bg-secondary'
                  }>
                    {cita.estado}
                  </span>
                </div>

                <p className="mb-1">
                  <strong>Servicio:</strong> {cita.servicio}
                </p>

                <p className="mb-1">
                  <strong>Fecha:</strong> {mostrarFecha(cita.fechaHora)}
                </p>

                <p className="mb-1">
                  <strong>Motivo:</strong> {cita.motivo}
                </p>

              {cita.estado === 'PROPUESTA' &&
                cita.fechaHoraPropuesta && (

                <div className="alert alert-info mt-3">

                  <h6 className="fw-bold">
                    📅 La veterinaria propone otro horario
                  </h6>

                  <p className="mb-2">
                    <strong>Nueva fecha:</strong>{' '}
                    {mostrarFecha(cita.fechaHoraPropuesta)}
                  </p>

                  <p className="mb-3">
                    ¿Aceptas este nuevo horario para tu mascota?
                  </p>

                  <button
                    className="btn btn-success"
                    onClick={() => void aceptarPropuesta(cita.id)}
                  >
                    Aceptar nuevo horario
                  </button>

                </div>
              )}

                <p className="mb-0 text-muted">
                  Solicitud #{cita.id}
                </p>

              {cita.estado === 'PENDIENTE' && (
                <button
                  className="btn btn-outline-danger mt-3"
                  disabled={cancelandoId !== null}
                  onClick={() => void cancelarCita(cita.id)}
                >
                  {cancelandoId === cita.id
                    ? 'Cancelando...'
                    : 'Cancelar solicitud'}
                </button>
              )}

              {avisoCancelacion?.id === cita.id && (
                <div
                  className={`alert mt-3 ${
                    avisoCancelacion.error
                      ? 'alert-danger'
                      : 'alert-success'
                  }`}
                  role="alert"
                >
                  {avisoCancelacion.texto}
                </div>
              )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
