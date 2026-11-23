import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  duenioUsuarioId: number;
}

interface Atencion {
  id: number;
  mascotaId: number;
  fechaAtencion: string;
  diagnostico: string;
  tratamiento: string | null;
  medicamentos: string | null;
  vacunas: string | null;
  proximoControl: string | null;
  proximaVacuna: string | null;
  registradoPorUsuarioId: number;
}

interface Formulario {
  fechaAtencion: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: string;
  vacunas: string;
  proximoControl: string;
  proximaVacuna: string;
}

const API = 'http://localhost:8081/api/mascotas';

const fechaActual = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const formularioInicial = (): Formulario => ({
  fechaAtencion: fechaActual(),
  diagnostico: '',
  tratamiento: '',
  medicamentos: '',
  vacunas: '',
  proximoControl: '',
  proximaVacuna: ''
});

export const FichasClinicas = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [mascotaId, setMascotaId] = useState('');
  const [historial, setHistorial] = useState<Atencion[]>([]);
  const [formulario, setFormulario] = useState<Formulario>(formularioInicial);
  const [atencionEditandoId, setAtencionEditandoId] = useState<number | null>(null);
  const [cargandoMascotas, setCargandoMascotas] = useState(true);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  let rol = '';
  try {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioVet') || 'null');
    rol = usuario?.rol || '';
  } catch {
    rol = '';
  }

  const autorizado = rol === 'RECEPCIONISTA' || rol === 'ADMINISTRADOR';

  const cargarMascotas = useCallback(async () => {
    const token = sessionStorage.getItem('tokenVet');
    setCargandoMascotas(true);
    setError('');

    try {
      if (!token) throw new Error('Debes volver a iniciar sesión.');

      const respuesta = await fetch(`${API}/recepcion`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : 'No se pudieron cargar las mascotas.'
        );
      }

      const datos: Mascota[] = await respuesta.json();
      setMascotas(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setCargandoMascotas(false);
    }
  }, []);

  useEffect(() => {
    if (autorizado) void cargarMascotas();
  }, [autorizado, cargarMascotas]);

  const cargarHistorial = async (id: string) => {
    setHistorial([]);
    setError('');
    if (!id) return;

    const token = sessionStorage.getItem('tokenVet');
    setCargandoHistorial(true);

    try {
      if (!token) throw new Error('Debes volver a iniciar sesión.');
      const respuesta = await fetch(`${API}/${id}/historial`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!respuesta.ok) throw new Error('No se pudo consultar el historial clínico.');

      const datos: Atencion[] = await respuesta.json();
      setHistorial(datos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar el historial.');
    } finally {
      setCargandoHistorial(false);
    }
  };

  const actualizar = (campo: keyof Formulario, valor: string) => {
    setFormulario(actual => ({ ...actual, [campo]: valor }));
  };

  const comenzarEdicion = (atencion: Atencion) => {
    setAtencionEditandoId(atencion.id);
    setFormulario({
      fechaAtencion: atencion.fechaAtencion,
      diagnostico: atencion.diagnostico,
      tratamiento: atencion.tratamiento || '',
      medicamentos: atencion.medicamentos || '',
      vacunas: atencion.vacunas || '',
      proximoControl: atencion.proximoControl || '',
      proximaVacuna: atencion.proximaVacuna || ''
    });
    setError('');
    setMensaje('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setAtencionEditandoId(null);
    setFormulario(formularioInicial());
    setError('');
  };

  const guardarAtencion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mascotaId || guardando) return;

    const token = sessionStorage.getItem('tokenVet');
    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      if (!token) throw new Error('Debes volver a iniciar sesión.');

      const editando = atencionEditandoId !== null;
      const url = editando
        ? `${API}/${mascotaId}/historial/${atencionEditandoId}`
        : `${API}/${mascotaId}/historial`;

      const respuesta = await fetch(url, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formulario,
          proximoControl: formulario.proximoControl || null,
          proximaVacuna: formulario.proximaVacuna || null
        })
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 400
            ? 'Revisa las fechas y los datos ingresados. La próxima vacuna requiere una vacuna indicada.'
            : respuesta.status === 401
              ? 'Tu sesión venció. Vuelve a iniciar sesión.'
              : respuesta.status === 403
                ? 'No tienes permiso para guardar esta atención.'
                : respuesta.status === 404
                  ? 'La atención ya no existe o no corresponde a esta mascota.'
                  : 'No se pudo guardar la atención clínica.'
        );
      }

      setFormulario(formularioInicial());
      setAtencionEditandoId(null);
      await cargarHistorial(mascotaId);
      setMensaje(editando
        ? 'Atención clínica actualizada correctamente.'
        : 'Atención clínica registrada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la atención.');
    } finally {
      setGuardando(false);
    }
  };

  if (!autorizado) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          No tienes permiso para acceder a las fichas clínicas.
        </div>
      </div>
    );
  }

  const mascotaSeleccionada = mascotas.find(m => m.id === Number(mascotaId));

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-primary mb-2">🩺 Fichas Clínicas</h2>
      <p className="text-muted mb-4">Registro y edición de atenciones e historial de pacientes.</p>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <label className="form-label fw-semibold" htmlFor="seleccionar-paciente">Seleccionar paciente</label>
          <select
            id="seleccionar-paciente"
            className="form-select"
            value={mascotaId}
            disabled={cargandoMascotas || guardando}
            onChange={e => {
              const id = e.target.value;
              setMascotaId(id);
              setAtencionEditandoId(null);
              setFormulario(formularioInicial());
              setMensaje('');
              void cargarHistorial(id);
            }}
          >
            <option value="">Seleccionar mascota</option>
            {mascotas.map(m => (
              <option key={m.id} value={m.id}>
                {m.nombre} - {m.especie} (ID #{m.id})
              </option>
            ))}
          </select>
          {cargandoMascotas && <p className="text-muted mt-2">Cargando pacientes...</p>}
          {mascotaSeleccionada && (
            <p className="mt-3 mb-0">
              <strong>Paciente:</strong> {mascotaSeleccionada.nombre}{' · '}
              <strong>Raza:</strong> {mascotaSeleccionada.raza || 'Sin especificar'}{' · '}
              <strong>ID dueño:</strong> {mascotaSeleccionada.duenioUsuarioId}
            </p>
          )}
        </div>
      </div>

      {mascotaId && (
        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="mb-3">
                  {atencionEditandoId !== null
                    ? `Editar atención #${atencionEditandoId}`
                    : 'Registrar atención'}
                </h4>

                {atencionEditandoId !== null && (
                  <div className="alert alert-warning py-2">
                    Estás modificando una atención existente.
                  </div>
                )}

                <form onSubmit={guardarAtencion}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="fecha-atencion">Fecha de atención</label>
                    <input
                      id="fecha-atencion"
                      type="date"
                      className="form-control"
                      value={formulario.fechaAtencion}
                      max={fechaActual()}
                      onChange={e => actualizar('fechaAtencion', e.target.value)}
                      required
                    />
                  </div>

                  {([
                    ['diagnostico', 'Diagnóstico *'],
                    ['tratamiento', 'Tratamiento'],
                    ['medicamentos', 'Medicamentos'],
                    ['vacunas', 'Vacunas aplicadas']
                  ] as const).map(([campo, etiqueta]) => (
                    <div className="mb-3" key={campo}>
                      <label className="form-label" htmlFor={`campo-${campo}`}>{etiqueta}</label>
                      <textarea
                        id={`campo-${campo}`}
                        className="form-control"
                        rows={3}
                        maxLength={2000}
                        value={formulario[campo]}
                        onChange={e => actualizar(campo, e.target.value)}
                        required={campo === 'diagnostico'}
                      />
                    </div>
                  ))}

                  <div className="mb-3">
                    <label className="form-label" htmlFor="proximo-control">Próximo control (opcional)</label>
                    <input
                      id="proximo-control"
                      type="date"
                      className="form-control"
                      value={formulario.proximoControl}
                      min={atencionEditandoId === null ? fechaActual() : undefined}
                      onChange={e => actualizar('proximoControl', e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="proxima-vacuna">Próxima vacuna (opcional)</label>
                    <input
                      id="proxima-vacuna"
                      type="date"
                      className="form-control"
                      value={formulario.proximaVacuna}
                      min={atencionEditandoId === null ? fechaActual() : undefined}
                      onChange={e => actualizar('proximaVacuna', e.target.value)}
                    />
                    <small className="text-muted">
                      Si registras la próxima vacuna, indica también la vacuna aplicada.
                    </small>
                  </div>

                  <button type="submit" className="btn btn-primary w-100" disabled={guardando}>
                    {guardando
                      ? 'Guardando...'
                      : atencionEditandoId !== null
                        ? 'Guardar cambios'
                        : 'Guardar atención clínica'}
                  </button>

                  {atencionEditandoId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      disabled={guardando}
                      onClick={cancelarEdicion}
                    >
                      Cancelar edición
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <h4 className="mb-3">Historial clínico</h4>
            {cargandoHistorial && <p>Cargando historial...</p>}
            {!cargandoHistorial && historial.length === 0 && !error && (
              <div className="alert alert-info">
                Esta mascota todavía no tiene atenciones clínicas registradas.
              </div>
            )}

            {!cargandoHistorial && historial.map(atencion => (
              <div key={atencion.id} className="card shadow-sm border-0 mb-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="text-primary mb-1">Atención #{atencion.id}</h5>
                      <span className="text-muted">Fecha: {atencion.fechaAtencion}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      disabled={guardando}
                      onClick={() => comenzarEdicion(atencion)}
                    >
                      ✏️ Editar atención
                    </button>
                  </div>

                  <p><strong>Diagnóstico:</strong> {atencion.diagnostico}</p>
                  {atencion.tratamiento && <p><strong>Tratamiento:</strong> {atencion.tratamiento}</p>}
                  {atencion.medicamentos && <p><strong>Medicamentos:</strong> {atencion.medicamentos}</p>}
                  {atencion.vacunas && <p><strong>Vacunas:</strong> {atencion.vacunas}</p>}
                  {atencion.proximoControl && (
                    <div className="alert alert-warning">
                      📅 <strong>Próximo control:</strong> {atencion.proximoControl}
                    </div>
                  )}
                  {atencion.proximaVacuna && (
                    <div className="alert alert-info">
                      💉 <strong>Próxima vacuna:</strong> {atencion.proximaVacuna}
                    </div>
                  )}
                  <p className="text-muted small mb-0">
                    Registrado originalmente por usuario #{atencion.registradoPorUsuarioId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
