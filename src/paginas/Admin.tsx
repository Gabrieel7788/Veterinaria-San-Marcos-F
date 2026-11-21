
import { useEffect, useState } from 'react';
import { TablaDatos } from '../componentes/organismos/TablaDatos';
import { FormularioServicio } from '../componentes/organismos/FormularioServicio';
import { serviciosIniciales } from '../datos/mockCatalogo';
import type { Servicio } from '../tipos/catalogo';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export const Admin = () => {

  // Servicios veterinarios (conservamos lo que ya tenías)
  const [servicios, setServicios] =
    useState<Servicio[]>(serviciosIniciales);

  const [servicioAEditar, setServicioAEditar] =
    useState<Servicio | null>(null);

  // Nuevos estados para usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [guardandoRol, setGuardandoRol] = useState<number | null>(null);
  const [mensajeUsuarios, setMensajeUsuarios] = useState('');
  const [pestana, setPestana] =
    useState<'servicios' | 'usuarios'>('servicios');

  // Verificar permisos
  let usuarioActual = null;

  try {
    usuarioActual = JSON.parse(
      sessionStorage.getItem('usuarioVet') || 'null'
    );
  } catch {
    usuarioActual = null;
  }

  const esAdministrador =
    usuarioActual?.rol === 'ADMINISTRADOR';

  // Crear o actualizar servicios
  const guardarServicio = (servicio: Servicio) => {
    if (servicioAEditar) {
      setServicios(
        servicios.map(s =>
          s.codigo === servicio.codigo ? servicio : s
        )
      );
      setServicioAEditar(null);
    } else {
      setServicios([...servicios, servicio]);
    }
  };

  // Eliminar servicios
  const eliminarServicio = (codigo: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setServicios(
        servicios.filter(s => s.codigo !== codigo)
      );
    }
  };

  // Consultar usuarios reales desde Spring Boot
  useEffect(() => {

    if (!esAdministrador || pestana !== 'usuarios') {
      return;
    }

    const token = sessionStorage.getItem('tokenVet');

    if (!token) {
      setError('Debes iniciar sesión nuevamente.');
      return;
    }

    const controller = new AbortController();

    const cargarUsuarios = async () => {
      setCargando(true);
      setError('');

      try {
        const respuesta = await fetch(
          'http://localhost:8080/api/admin/usuarios',
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
              : respuesta.status === 403
                ? 'No tienes permisos de administrador.'
                : 'No se pudieron cargar los usuarios.'
          );
        }

        const datos: Usuario[] = await respuesta.json();

        if (!controller.signal.aborted) {
          setUsuarios(datos);
        }

      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Error al consultar los usuarios.'
        );

      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    void cargarUsuarios();

    return () => controller.abort();

  }, [esAdministrador, pestana, recarga]);


  const cambiarRol = async (
    id: number,
    nuevoRol: string
  ) => {

    const token = sessionStorage.getItem('tokenVet');

    if (!token || guardandoRol !== null) return;

    const confirmar = window.confirm(
      `¿Deseas cambiar el rol del usuario #${id} a ${nuevoRol}?`
    );

    if (!confirmar) return;

    setGuardandoRol(id);
    setError('');
    setMensajeUsuarios('');

    try {
      const respuesta = await fetch(
        `http://localhost:8080/api/admin/usuarios/${id}/rol`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rol: nuevoRol
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 403
            ? 'No tienes permisos para cambiar roles.'
            : respuesta.status === 401
              ? 'Tu sesión venció. Vuelve a iniciar sesión.'
              : 'No se pudo actualizar el rol del usuario.'
        );
      }

      const actualizado: Usuario = await respuesta.json();

      setUsuarios(anteriores =>
        anteriores.map(usuario =>
          usuario.id === id ? actualizado : usuario
        )
      );

      setMensajeUsuarios(
        `Rol del usuario #${id} actualizado correctamente.`
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al cambiar el rol.'
      );
    } finally {
      setGuardandoRol(null);
    }
  };



  const mostrarRol = (rol: string) => {
    switch (rol) {
      case 'ADMINISTRADOR':
        return 'Administrador';
      case 'RECEPCIONISTA':
        return 'Recepcionista';
      case 'DUENO_MASCOTA':
        return 'Dueño de mascota';
      default:
        return rol;
    }
  };

  if (!esAdministrador) {
    return (
      <div className="alert alert-danger mt-5 text-center shadow-sm p-5 border-0">
        <h2 className="alert-heading text-danger fw-bold">
          🚫 Acceso Denegado
        </h2>
        <p className="lead">
          Esta área es exclusiva para el personal administrativo.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h2 className="fw-bold text-primary mb-2">
        Panel de Administración
      </h2>

      <p className="text-muted mb-4">
        Veterinaria San Marcos
      </p>

      {/* Pestañas */}
      <div className="d-flex flex-wrap gap-2 mb-4">

        <button
          type="button"
          className={`btn ${
            pestana === 'servicios'
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={() => setPestana('servicios')}
        >
          🩺 Servicios veterinarios
        </button>

        <button
          type="button"
          className={`btn ${
            pestana === 'usuarios'
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={() => setPestana('usuarios')}
        >
          👥 Usuarios registrados
        </button>

      </div>

      {/* Pestaña de servicios */}
      {pestana === 'servicios' && (
        <div>

          <h4 className="mb-4">
            Administración de servicios
          </h4>

          <FormularioServicio
            servicioAEditar={servicioAEditar}
            alGuardar={guardarServicio}
            alCancelar={() => setServicioAEditar(null)}
          />

          <TablaDatos
            columnas={[
              'Código',
              'Categoría',
              'Nombre',
              'Precio'
            ]}
            datos={servicios}
            alEditar={setServicioAEditar}
            alEliminar={eliminarServicio}
          />

        </div>
      )}

      {/* Pestaña de usuarios */}
      {pestana === 'usuarios' && (
        <div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">

            <h4 className="mb-0">
              Usuarios registrados ({usuarios.length})
            </h4>

            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              disabled={cargando}
              onClick={() => setRecarga(n => n + 1)}
            >
              Actualizar
            </button>

          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {mensajeUsuarios && (
            <div className="alert alert-success" role="status">
              {mensajeUsuarios}
            </div>
          )}  

          {cargando && (
            <p>Cargando usuarios...</p>
          )}

          {!cargando && !error && usuarios.length === 0 && (
            <div className="alert alert-info">
              No hay usuarios registrados.
            </div>
          )}

          {!cargando && usuarios.length > 0 && (
            <div className="card shadow-sm border-0">

              <div className="card-body">

                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {usuarios.map(usuario => (
                        <tr key={usuario.id}>

                          <td>{usuario.id}</td>

                          <td>{usuario.nombre}</td>

                          <td>{usuario.correo}</td>

                          <td>
                            <span className={`badge ${
                              usuario.rol === 'ADMINISTRADOR'
                                ? 'bg-danger'
                                : usuario.rol === 'RECEPCIONISTA'
                                  ? 'bg-primary'
                                  : 'bg-success'
                            }`}>
                              {mostrarRol(usuario.rol)}
                            </span>
                          </td>
                          
                          <td>
                            {usuario.rol === 'ADMINISTRADOR' ? (
                              <span className="text-muted">
                                Cuenta protegida
                              </span>
                            ) : (
                              <select
                                className="form-select form-select-sm"
                                value={usuario.rol}
                                disabled={guardandoRol !== null}
                                onChange={e =>
                                  void cambiarRol(usuario.id, e.target.value)
                                }
                              >
                                <option value="DUENO_MASCOTA">
                                  Dueño de mascota
                                </option>

                                <option value="RECEPCIONISTA">
                                  Recepcionista
                                </option>
                              </select>
                            )}
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
