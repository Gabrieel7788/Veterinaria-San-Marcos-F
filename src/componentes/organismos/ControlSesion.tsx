import { useEffect } from 'react';

function obtenerExpiracion(token: string): number | null {
  try {
    const parte = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const datos = JSON.parse(atob(parte));

    return typeof datos.exp === 'number'
      ? datos.exp * 1000
      : null;
  } catch {
    return null;
  }
}

export const ControlSesion = () => {

  useEffect(() => {
    let renovando = false;
    let ultimaActividad = Date.now();
    let activo = true;

    const cerrarSesion = () => {
      sessionStorage.removeItem('tokenVet');
      sessionStorage.removeItem('usuarioVet');
      localStorage.removeItem('usuarioVet');

      window.location.replace('/login?sesion=expirada');
    };

    const registrarActividad = () => {
      ultimaActividad = Date.now();
    };

    const revisarSesion = async () => {
      const token = sessionStorage.getItem('tokenVet');

      if (!token) return;

      const expiracion = obtenerExpiracion(token);

      if (!expiracion || expiracion <= Date.now()) {
        cerrarSesion();
        return;
      }

      const tiempoRestante = expiracion - Date.now();

      // Renovar solo cuando quedan menos de 5 minutos.
      if (tiempoRestante > 5 * 60 * 1000) return;

      // No renovar sesiones inactivas.
      if (Date.now() - ultimaActividad > 5 * 60 * 1000) {
        return;
      }

      if (renovando) return;
      renovando = true;

      try {
        const respuesta = await fetch(
          'http://localhost:8080/api/auth/renovar',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!activo) return;

        if (respuesta.status === 401 ||
            respuesta.status === 403) {
          cerrarSesion();
          return;
        }

        if (!respuesta.ok) return;

        const datos = await respuesta.json();

        if (typeof datos.token === 'string') {
          sessionStorage.setItem('tokenVet', datos.token);
        }

      } catch {
        // Si falla la conexión, se conserva el token
        // hasta su vencimiento original.
      } finally {
        renovando = false;
      }
    };

    const alVolver = () => {
      registrarActividad();
      void revisarSesion();
    };

    window.addEventListener('pointerdown', registrarActividad);
    window.addEventListener('keydown', registrarActividad);
    window.addEventListener('focus', alVolver);

    void revisarSesion();

    const intervalo = window.setInterval(
      () => void revisarSesion(),
      30000
    );

    return () => {
      activo = false;
      window.clearInterval(intervalo);
      window.removeEventListener(
        'pointerdown',
        registrarActividad
      );
      window.removeEventListener(
        'keydown',
        registrarActividad
      );
      window.removeEventListener('focus', alVolver);
    };
  }, []);

  return null;
};
