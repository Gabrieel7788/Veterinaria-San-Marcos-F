import { useState } from 'react';
import type { FormEvent } from 'react';

interface Atencion {
  id: number;
  mascotaId: number;
  fechaAtencion: string;
  diagnostico: string;
  tratamiento: string | null;
  medicamentos: string | null;
  vacunas: string | null;
  registradoPorUsuarioId: number;
}

interface Reporte {
  desde: string;
  hasta: string;
  totalAtenciones: number;
  mascotasAtendidas: number;
  detalle: Atencion[];
}

const hoy = new Date();

const fechaLocal = (fecha: Date) =>
  `${fecha.getFullYear()}-${String(
    fecha.getMonth() + 1
  ).padStart(2, '0')}-${String(
    fecha.getDate()
  ).padStart(2, '0')}`;

export const ReportesClinicos = () => {

  const [desde, setDesde] = useState(
    fechaLocal(new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    ))
  );

  const [hasta, setHasta] = useState(fechaLocal(hoy));
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const generarReporte = async (e: FormEvent) => {
    e.preventDefault();

    setError('');
    setReporte(null);

    if (hasta < desde) {
      setError('La fecha final debe ser igual o posterior a la inicial.');
      return;
    }

    const token = sessionStorage.getItem('tokenVet');

    if (!token) {
      setError('Debes iniciar sesión nuevamente.');
      return;
    }

    setCargando(true);

    try {
      const parametros = new URLSearchParams({
        desde,
        hasta
      });

      const respuesta = await fetch(
        `http://localhost:8081/api/mascotas/reportes/atenciones?${parametros}`,
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
            : respuesta.status === 403
              ? 'No tienes permisos para consultar reportes.'
              : 'No se pudo generar el reporte.'
        );
      }

      const datos: Reporte = await respuesta.json();
      setReporte(datos);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al generar el reporte.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>

      <h4 className="mb-3">
        📊 Reportes de atenciones clínicas
      </h4>

      <p className="text-muted">
        Consulta las atenciones registradas en un período.
      </p>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">

          <form onSubmit={generarReporte}>
            <div className="row g-3 align-items-end">

              <div className="col-12 col-md-4">
                <label className="form-label">
                  Desde
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={desde}
                  onChange={e => setDesde(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label">
                  Hasta
                </label>

                <input
                  type="date"
                  className="form-control"
                  value={hasta}
                  onChange={e => setHasta(e.target.value)}
                  required
                />
              </div>

              <div className="col-12 col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={cargando}
                >
                  {cargando
                    ? 'Generando...'
                    : 'Generar reporte'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {reporte && (
        <div>

          <div className="row g-3 mb-4">

            <div className="col-12 col-md-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1">
                    Atenciones registradas
                  </p>
                  <h2 className="fw-bold text-primary">
                    {reporte.totalAtenciones}
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1">
                    Mascotas atendidas
                  </p>
                  <h2 className="fw-bold text-success">
                    {reporte.mascotasAtendidas}
                  </h2>
                </div>
              </div>
            </div>

          </div>

          <h5 className="mb-3">
            Detalle de atenciones
          </h5>

          {reporte.detalle.length === 0 ? (
            <div className="alert alert-info">
              No hay atenciones registradas entre
              las fechas seleccionadas.
            </div>
          ) : (
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="table-responsive">

                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Mascota ID</th>
                        <th>Diagnóstico</th>
                        <th>Vacunas</th>
                        <th>Registrado por</th>
                      </tr>
                    </thead>

                    <tbody>
                      {reporte.detalle.map(atencion => (
                        <tr key={atencion.id}>
                          <td>{atencion.id}</td>
                          <td>{atencion.fechaAtencion}</td>
                          <td>{atencion.mascotaId}</td>
                          <td>{atencion.diagnostico}</td>
                          <td>
                            {atencion.vacunas || '—'}
                          </td>
                          <td>
                            Usuario #{atencion.registradoPorUsuarioId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
