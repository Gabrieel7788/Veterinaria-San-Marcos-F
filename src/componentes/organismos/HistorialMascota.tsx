import { useState } from 'react';

interface Atencion {
  id: number;
  fechaAtencion: string;
  diagnostico: string;
  tratamiento: string | null;
  medicamentos: string | null;
  vacunas: string | null;
  proximoControl: string | null;
  proximaVacuna: string | null;
}

interface Props {
  mascotaId: number;
}

export const HistorialMascota = ({ mascotaId }: Props) => {

  const [abierto, setAbierto] = useState(false);
  const [historial, setHistorial] = useState<Atencion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const verHistorial = async () => {

    if (abierto) {
      setAbierto(false);
      return;
    }

    setAbierto(true);
    setError('');
    setCargando(true);
    setHistorial([]);

    const token = sessionStorage.getItem('tokenVet');

    if (!token) {
      setError('Debes iniciar sesión nuevamente.');
      setCargando(false);
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:8081/api/mascotas/${mascotaId}/historial`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : respuesta.status === 403 ||
              respuesta.status === 404
              ? 'No tienes acceso al historial de esta mascota.'
              : 'No se pudo cargar el historial clínico.'
        );
      }

      const datos: Atencion[] = await respuesta.json();

      setHistorial(datos);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al consultar el historial.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-top">

      <button
        type="button"
        className="btn btn-outline-info btn-sm"
        onClick={() => void verHistorial()}
        disabled={cargando}
      >
        {cargando
          ? 'Cargando historial...'
          : abierto
            ? 'Ocultar historial clínico'
            : '🩺 Ver historial clínico'}
      </button>

      {abierto && (
        <div className="mt-3">

          <h6 className="fw-bold text-primary mb-3">
            Historial clínico
          </h6>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!cargando && !error && historial.length === 0 && (
            <div className="alert alert-info">
              Esta mascota todavía no tiene
              atenciones clínicas registradas.
            </div>
          )}

          {!cargando && historial.map(atencion => (

            <div
              key={atencion.id}
              className="card bg-light border-0 mb-3"
            >
              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

                  <strong className="text-primary">
                    Atención #{atencion.id}
                  </strong>

                  <span className="badge bg-secondary">
                    {atencion.fechaAtencion}
                  </span>

                </div>

                <p className="mb-2">
                  <strong>Diagnóstico:</strong>{' '}
                  {atencion.diagnostico}
                </p>

                {atencion.tratamiento && (
                  <p className="mb-2">
                    <strong>Tratamiento:</strong>{' '}
                    {atencion.tratamiento}
                  </p>
                )}

                {atencion.medicamentos && (
                  <p className="mb-2">
                    <strong>Medicamentos:</strong>{' '}
                    {atencion.medicamentos}
                  </p>
                )}

                {atencion.vacunas && (
                  <p className="mb-2">
                    <strong>Vacunas:</strong>{' '}
                    {atencion.vacunas}
                  </p>
                )}

                {atencion.proximoControl && (
                  <div className="alert alert-warning mb-0">
                    📅 <strong>Próximo control:</strong>{' '}
                    {atencion.proximoControl}
                  </div>
                )}

                {atencion.proximaVacuna && (
                  <div className="alert alert-info mt-2">
                    💉 <strong>Próxima vacuna:</strong>{' '}
                    {atencion.proximaVacuna}
                  </div>
                )}

              </div>
            </div>

          ))}

        </div>
      )}

    </div>
  );
};
