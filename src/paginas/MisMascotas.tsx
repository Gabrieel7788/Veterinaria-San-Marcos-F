import { useCallback, useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { HistorialMascota } from '../componentes/organismos/HistorialMascota';
import { AvisosMascota } from '../componentes/organismos/AvisosMascota';

interface Mascota {
  id: number;
  duenioUsuarioId: number;
  nombre: string;
  especie: string;
  raza: string | null;
  fechaNacimiento: string | null;
}

interface FormularioMascota {
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
}

const formularioVacio: FormularioMascota = {
  nombre: '',
  especie: '',
  raza: '',
  fechaNacimiento: ''
};

const API = 'http://localhost:8081/api/mascotas';

export const MisMascotas = () => {
console.log('El componente MisMascotas se está ejecutando');

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [datos, setDatos] = useState<FormularioMascota>(
    formularioVacio
  );

  const [editando, setEditando] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const token = sessionStorage.getItem('tokenVet');

  let rol = '';

  try {
    const usuario = JSON.parse(
      sessionStorage.getItem('usuarioVet') || 'null'
    );
    rol = usuario?.rol || '';
  } catch {
    rol = '';
  }

  const autorizado = Boolean(
    token && rol === 'DUENO_MASCOTA'
  );

  // Obtener las mascotas registradas en MySQL
  const cargarMascotas = useCallback(async () => {

    const tokenActual = sessionStorage.getItem('tokenVet');
    if (!tokenActual) return;

    setCargando(true);
    setError('');

    try {
      const respuesta = await fetch(`${API}/mias`, {
        headers: {
          Authorization: `Bearer ${tokenActual}`
        }
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Cierra sesión y vuelve a ingresar.'
            : 'No se pudieron cargar las mascotas.'
        );
      }

      const lista = (await respuesta.json()) as Mascota[];
      setMascotas(lista);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error de conexión con el servidor.'
      );
    } finally {
      setCargando(false);
    }

  }, []);

  useEffect(() => {
    if (autorizado) {
      void cargarMascotas();
    }
  }, [autorizado, cargarMascotas]);

  const cambiarCampo = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDatos(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Crear o actualizar una mascota
  const guardarMascota = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (guardando || !token) return;

    setGuardando(true);
    setError('');
    setMensaje('');

    const esEdicion = editando !== null;

    try {
      const respuesta = await fetch(
        esEdicion ? `${API}/${editando}` : API,
        {
          method: esEdicion ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre: datos.nombre.trim(),
            especie: datos.especie,
            raza: datos.raza.trim() || null,
            fechaNacimiento: datos.fechaNacimiento || null
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : respuesta.status === 400
              ? 'Revisa los datos de la mascota.'
              : 'No se pudo guardar la mascota.'
        );
      }

      setMensaje(
        esEdicion
          ? 'Mascota actualizada correctamente.'
          : '¡Mascota registrada correctamente!'
      );

      setDatos(formularioVacio);
      setEditando(null);

      await cargarMascotas();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al guardar la mascota.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const comenzarEdicion = (mascota: Mascota) => {
    setEditando(mascota.id);

    setDatos({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza || '',
      fechaNacimiento: mascota.fechaNacimiento || ''
    });

    setMensaje('');
    setError('');
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setDatos(formularioVacio);
  };

  // Eliminar una mascota
  const eliminarMascota = async (mascota: Mascota) => {

    if (!token) return;

    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar a ${mascota.nombre}?`
    );

    if (!confirmar) return;

    setError('');
    setMensaje('');

    try {
      const respuesta = await fetch(`${API}/${mascota.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : 'No se pudo eliminar la mascota.'
        );
      }

      if (editando === mascota.id) {
        cancelarEdicion();
      }

      setMensaje('Mascota eliminada correctamente.');
      await cargarMascotas();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al eliminar la mascota.'
      );
    }
  };

  // Solo los dueños registrados pueden usar esta pantalla
  if (!autorizado) {
    return (
      <div className="alert alert-warning mt-4 text-center">
        <h3>Acceso restringido</h3>
        <p>Debes ingresar como dueño de mascota.</p>
        <Link to="/login" className="btn btn-primary mt-3">
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h2 className="text-primary fw-bold mb-2">
        🐾 Mis Mascotas
      </h2>

      <p className="text-muted mb-4">
        Registra y administra los datos de tus mascotas.
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

      <div className="row g-4">

        {/* FORMULARIO */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="mb-4">
                {editando !== null
                  ? 'Editar mascota'
                  : 'Registrar mascota'}
              </h4>

              <form onSubmit={guardarMascota}>

                <div className="mb-3">
                  <label htmlFor="nombreMascota" className="form-label">
                    Nombre
                  </label>
                  <input
                    id="nombreMascota"
                    className="form-control"
                    name="nombre"
                    value={datos.nombre}
                    onChange={cambiarCampo}
                    maxLength={80}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="especieMascota" className="form-label">
                    Especie
                  </label>
                  <select
                    id="especieMascota"
                    className="form-select"
                    name="especie"
                    value={datos.especie}
                    onChange={cambiarCampo}
                    required
                  >
                    <option value="">Selecciona una especie</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="razaMascota" className="form-label">
                    Raza (opcional)
                  </label>
                  <input
                    id="razaMascota"
                    className="form-control"
                    name="raza"
                    value={datos.raza}
                    onChange={cambiarCampo}
                    maxLength={80}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fechaMascota" className="form-label">
                    Fecha de nacimiento (opcional)
                  </label>
                  <input
                    id="fechaMascota"
                    type="date"
                    className="form-control"
                    name="fechaNacimiento"
                    value={datos.fechaNacimiento}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={cambiarCampo}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : editando !== null
                      ? 'Guardar cambios'
                      : 'Registrar mascota'}
                </button>

                {editando !== null && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={cancelarEdicion}
                  >
                    Cancelar edición
                  </button>
                )}

              </form>
            </div>
          </div>
        </div>

        {/* LISTADO */}
        <div className="col-12 col-lg-7">
          <h4 className="mb-3">Mascotas registradas</h4>

          {cargando && (
            <p className="text-muted">Cargando mascotas...</p>
          )}

          {!cargando && mascotas.length === 0 && (
            <div className="alert alert-info">
              Todavía no tienes mascotas registradas.
            </div>
          )}

          {mascotas.map(mascota => (
            <div
              key={mascota.id}
              className="card shadow-sm border-0 mb-3"
            >
              <div className="card-body">

                <h5 className="fw-bold text-primary">
                  🐾 {mascota.nombre}
                </h5>

                <p className="mb-1">
                  <strong>Especie:</strong> {mascota.especie}
                </p>

                <p className="mb-1">
                  <strong>Raza:</strong> {mascota.raza || 'No indicada'}
                </p>

                <p className="mb-3">
                  <strong>Fecha de nacimiento:</strong>{' '}
                  {mascota.fechaNacimiento || 'No indicada'}
                </p>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => comenzarEdicion(mascota)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => void eliminarMascota(mascota)}
                  >
                    Eliminar
                  </button>
                </div>

              <HistorialMascota mascotaId={mascota.id} />
              
              <AvisosMascota mascotaId={mascota.id} />

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};
