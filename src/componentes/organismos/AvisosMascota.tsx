import { useEffect, useState } from 'react';

interface Atencion {
  id: number;
  fechaAtencion: string;
  proximoControl: string | null;
  proximaVacuna: string | null;
}

interface Props {
  mascotaId: number;
}

interface Aviso {
  titulo: string;
  fecha: string;
  icono: string;
}

// Calcula días comparando fechas de calendario,
// evitando problemas con los cambios de horario.
const calcularDias = (fecha: string): number => {
  const hoy = new Date();

  const [anio, mes, dia] = fecha.split('-').map(Number);

  const fechaObjetivo = Date.UTC(anio, mes - 1, dia);

  const fechaHoy = Date.UTC(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );

  return Math.round(
    (fechaObjetivo - fechaHoy) / 86400000
  );
};

const formatearFecha = (fecha: string): string => {
  return new Date(`${fecha}T12:00:00`)
    .toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
};

export const AvisosMascota = ({ mascotaId }: Props) => {

  const [atenciones, setAtenciones] = useState<Atencion[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('tokenVet');
    const controller = new AbortController();

    const cargarAvisos = async () => {
      if (!token) return;

      try {
        const respuesta = await fetch(
          `http://localhost:8081/api/mascotas/${mascotaId}/historial`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            signal: controller.signal
          }
        );

        if (!respuesta.ok) {
          throw new Error(
            'No se pudieron consultar los recordatorios.'
          );
        }

        const datos: Atencion[] = await respuesta.json();

        if (!controller.signal.aborted) {
          setAtenciones(datos);
        }

      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Error al cargar recordatorios.'
        );
      }
    };

    void cargarAvisos();

    return () => controller.abort();

  }, [mascotaId]);

  // El historial llega ordenado desde la atención
  // más reciente. Usamos la última fecha registrada
  // para cada tipo de recordatorio.
  const proximaVacuna = atenciones.find(
    a => a.proximaVacuna
  )?.proximaVacuna;

  const proximoControl = atenciones.find(
    a => a.proximoControl
  )?.proximoControl;

  const avisos: Aviso[] = [];

  if (proximaVacuna) {
    avisos.push({
      titulo: 'Próxima vacunación',
      fecha: proximaVacuna,
      icono: '💉'
    });
  }

  if (proximoControl) {
    avisos.push({
      titulo: 'Próximo control veterinario',
      fecha: proximoControl,
      icono: '📅'
    });
  }

  const mensajeDias = (dias: number) => {
    if (dias < 0) {
      const cantidad = Math.abs(dias);
      return `La fecha registrada pasó hace ${cantidad} día${cantidad === 1 ? '' : 's'}.`;
    }

    if (dias === 0) {
      return '¡La fecha programada es hoy!';
    }

    if (dias === 1) {
      return '¡La fecha programada es mañana!';
    }

    return `Faltan ${dias} días.`;
  };

  const claseAlerta = (dias: number) => {
    if (dias < 0) return 'alert-danger';
    if (dias <= 7) return 'alert-warning';
    if (dias <= 30) return 'alert-info';
    return 'alert-light border';
  };

  if (error) {
    return (
      <p className="text-muted small mt-3" role="status">
        {error}
      </p>
    );
  }

  if (avisos.length === 0) {
    return null;
  }

  return (
    <div className="mt-3">

      <h6 className="fw-bold mb-3">
        🔔 Recordatorios de salud
      </h6>

      {avisos.map((aviso, index) => {
        const dias = calcularDias(aviso.fecha);

        return (
          <div
            key={`${aviso.titulo}-${index}`}
            className={`alert ${claseAlerta(dias)} mb-2`}
            role="status"
          >
            <strong>
              {aviso.icono} {aviso.titulo}
            </strong>

            <p className="mb-1 mt-2">
              Fecha: {formatearFecha(aviso.fecha)}
            </p>

            <small>
              {mensajeDias(dias)}
            </small>
          </div>
        );
      })}

    </div>
  );
};
