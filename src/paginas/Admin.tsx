import { useEffect, useState } from 'react';
import { TablaDatos } from '../componentes/organismos/TablaDatos';
import { FormularioServicio } from '../componentes/organismos/FormularioServicio';
import { FormularioCrearUsuario } from '../componentes/organismos/FormularioCrearUsuario';
import { serviciosIniciales } from '../datos/mockCatalogo';
import type { Servicio } from '../tipos/catalogo';
import { ReportesClinicos } from '../componentes/organismos/ReportesClinicos';

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

const API_USUARIOS = 'http://localhost:8080/api/admin/usuarios';

export const Admin = () => {
  // Conservamos la administración de servicios que ya funcionaba.
  const [servicios, setServicios] = useState<Servicio[]>(serviciosIniciales);
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

  // Administración de usuarios reales en MySQL.
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardandoUsuario, setGuardandoUsuario] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mensajeUsuarios, setMensajeUsuarios] = useState('');
  const [recarga, setRecarga] = useState(0);
  const [mostrarCrearUsuario, setMostrarCrearUsuario] = useState(false);
 const [pestana, setPestana] = useState<'servicios' | 'usuarios' | 'reportes'>('servicios');
  

  let usuarioActual: { rol?: string } | null = null;
  try {
    usuarioActual = JSON.parse(sessionStorage.getItem('usuarioVet') || 'null');
  } catch {
    usuarioActual = null;
  }
  const esAdministrador = usuarioActual?.rol === 'ADMINISTRADOR';

  const guardarServicio = (servicio: Servicio) => {
    if (servicioAEditar) {
      setServicios(anteriores =>
        anteriores.map(s => s.codigo === servicio.codigo ? servicio : s)
      );
      setServicioAEditar(null);
    } else {
      setServicios(anteriores => [...anteriores, servicio]);
    }
  };

  const eliminarServicio = (codigo: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setServicios(anteriores => anteriores.filter(s => s.codigo !== codigo));
    }
  };

  useEffect(() => {
    if (!esAdministrador || pestana !== 'usuarios') return;

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
        const respuesta = await fetch(API_USUARIOS, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
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
        if (!controller.signal.aborted) setUsuarios(datos);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'Error al cargar usuarios.');
        }
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };
    void cargarUsuarios();
    return () => controller.abort();
  }, [esAdministrador, pestana, recarga]);

  // Una sola función para guardar cambios de nombre, rol y estado.
  const actualizarUsuario = async (
    id: number,
    operacion: 'rol' | 'nombre' | 'estado',
    datos: object,
    mensaje: string
  ) => {
    const token = sessionStorage.getItem('tokenVet');
    if (!token || guardandoUsuario !== null) {
      setError(!token ? 'Debes iniciar sesión nuevamente.' : 'Espera a que termine la operación.');
      return;
    }
    setGuardandoUsuario(id);
    setError('');
    setMensajeUsuarios('');
    try {
      const respuesta = await fetch(`${API_USUARIOS}/${id}/${operacion}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });
      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 401
            ? 'Tu sesión venció. Vuelve a iniciar sesión.'
            : respuesta.status === 403
              ? 'No tienes permisos para esta operación.'
              : respuesta.status === 409
                ? 'La operación no está permitida para este usuario.'
                : 'No se pudo actualizar el usuario.'
        );
      }
      const actualizado: Usuario = await respuesta.json();
      setUsuarios(anteriores =>
        anteriores.map(u => u.id === id ? actualizado : u)
      );
      setMensajeUsuarios(mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setGuardandoUsuario(null);
    }
  };

  const cambiarRol = (usuario: Usuario, nuevoRol: string) => {
    if (nuevoRol === usuario.rol) return;
    if (window.confirm(`¿Cambiar el rol de ${usuario.nombre} a ${nuevoRol}?`)) {
      void actualizarUsuario(usuario.id, 'rol', { rol: nuevoRol }, 'Rol actualizado correctamente.');
    }
  };

  const cambiarEstado = (usuario: Usuario) => {
    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    if (window.confirm(`¿Deseas ${accion} a ${usuario.nombre}?`)) {
      void actualizarUsuario(
        usuario.id, 'estado', { activo: nuevoEstado },
        nuevoEstado ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.'
      );
    }
  };

  const editarNombre = (usuario: Usuario) => {
    const respuesta = window.prompt('Ingresa el nuevo nombre:', usuario.nombre);
    if (respuesta === null) return;
    const nombre = respuesta.trim();
    if (!nombre || nombre.length > 100) {
      setError('El nombre debe tener entre 1 y 100 caracteres.');
      return;
    }
    if (nombre !== usuario.nombre) {
      void actualizarUsuario(usuario.id, 'nombre', { nombre }, 'Nombre actualizado correctamente.');
    }
  };

  const mostrarRol = (rol: string) => {
    switch (rol) {
      case 'ADMINISTRADOR': return 'Administrador';
      case 'RECEPCIONISTA': return 'Recepcionista';
      case 'DUENO_MASCOTA': return 'Dueño de mascota';
      default: return rol;
    }
  };

  if (!esAdministrador) {
    return (
      <div className="alert alert-danger mt-5 text-center shadow-sm p-5 border-0">
        <h2 className="alert-heading fw-bold">🚫 Acceso denegado</h2>
        <p className="lead">Esta área es exclusiva para el personal administrativo.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold text-primary mb-2">Panel de Administración</h2>
      <p className="text-muted mb-4">Veterinaria San Marcos</p>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className={`btn ${pestana === 'servicios' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setPestana('servicios')}
        >
          🩺 Servicios veterinarios
        </button>

        <button
          type="button"
          className={`btn ${
            pestana === 'reportes'
              ? 'btn-primary'
              : 'btn-outline-primary'
          }`}
          onClick={() => setPestana('reportes')}
        >
          📊 Reportes clínicos
        </button>

        <button
          type="button"
          className={`btn ${pestana === 'usuarios' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setPestana('usuarios')}
        >
          👥 Usuarios registrados
        </button>
      </div>

      {pestana === 'servicios' && (
        <div>
          <h4 className="mb-4">Administración de servicios</h4>
          <FormularioServicio
            servicioAEditar={servicioAEditar}
            alGuardar={guardarServicio}
            alCancelar={() => setServicioAEditar(null)}
          />
          <TablaDatos
            columnas={['Código', 'Categoría', 'Nombre', 'Precio']}
            datos={servicios}
            alEditar={setServicioAEditar}
            alEliminar={eliminarServicio}
          />
        </div>
      )}

      {pestana === 'usuarios' && (
        <div>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h4 className="mb-0">Usuarios registrados ({usuarios.length})</h4>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => setMostrarCrearUsuario(valor => !valor)}
              >
                {mostrarCrearUsuario ? 'Cerrar formulario' : '+ Nuevo usuario'}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                disabled={cargando}
                onClick={() => setRecarga(n => n + 1)}
              >
                Actualizar
              </button>
            </div>
          </div>

          {mostrarCrearUsuario && (
            <FormularioCrearUsuario
              onCreado={() => {
                setMostrarCrearUsuario(false);
                setMensajeUsuarios('Usuario creado correctamente.');
                setRecarga(n => n + 1);
              }}
            />
          )}

          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          {mensajeUsuarios && (
            <div className="alert alert-success" role="status">{mensajeUsuarios}</div>
          )}
          {cargando && <p>Cargando usuarios...</p>}
          {!cargando && !error && usuarios.length === 0 && (
            <div className="alert alert-info">No hay usuarios registrados.</div>
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
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(usuario => (
                        <tr key={usuario.id}>
                          <td>{usuario.id}</td>
                          <td>{usuario.nombre}</td>
                          <td>{usuario.correo}</td>

                          {/* Cada encabezado tiene exactamente su propia celda */}
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
                            <div className="d-flex align-items-center flex-wrap gap-2">
                              {usuario.rol === 'ADMINISTRADOR' ? (
                                <span className="text-muted">Cuenta protegida</span>
                              ) : (
                                <select
                                  aria-label={`Rol del usuario ${usuario.nombre}`}
                                  className="form-select form-select-sm w-auto"
                                  value={usuario.rol}
                                  disabled={guardandoUsuario !== null}
                                  onChange={e => cambiarRol(usuario, e.target.value)}
                                >
                                  <option value="DUENO_MASCOTA">Dueño de mascota</option>
                                  <option value="RECEPCIONISTA">Recepcionista</option>
                                </select>
                              )}

                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={guardandoUsuario !== null}
                                onClick={() => editarNombre(usuario)}
                              >
                                ✏️ Editar nombre
                              </button>

                              {usuario.rol !== 'ADMINISTRADOR' && (
                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    usuario.activo ? 'btn-outline-danger' : 'btn-outline-success'
                                  }`}
                                  disabled={guardandoUsuario !== null}
                                  onClick={() => cambiarEstado(usuario)}
                                >
                                  {usuario.activo ? 'Desactivar' : 'Activar'}
                                </button>
                              )}
                            </div>
                          </td>

                          <td>
                            <span className={`badge ${usuario.activo ? 'bg-success' : 'bg-danger'}`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
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
      {pestana === 'reportes' && (<ReportesClinicos />)}
    </div>
  );
};
