
import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onCreado: () => void;
}

type Campos = {
  rut: string;
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
  confirmarPassword: string;
  region: string;
  comuna: string;
  direccion: string;
};

const inicial: Campos = {
  rut: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  confirmarPassword: '',
  region: '',
  comuna: '',
  direccion: ''
};

export const FormularioCrearUsuario = ({ onCreado }: Props) => {

  const [datos, setDatos] = useState<Campos>(inicial);
  const [rol, setRol] = useState('DUENO_MASCOTA');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const actualizar = (campo: keyof Campos, valor: string) => {
    setDatos(actual => ({
      ...actual,
      [campo]: valor
    }));
  };

  const crearUsuario = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (guardando) return;

    if (datos.password !== datos.confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const token = sessionStorage.getItem('tokenVet');

    if (!token) {
      setError('Debes volver a iniciar sesión.');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      const respuesta = await fetch(
        'http://localhost:8080/api/admin/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rol,
            datos: {
              ...datos,
              rut: datos.rut.replace(/[.\-]/g, '').toUpperCase(),
              fechaNacimiento: null
            }
          })
        }
      );

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 409
            ? 'El correo o el RUT ya están registrados.'
            : respuesta.status === 400
              ? 'Revisa el RUT y los datos ingresados.'
              : respuesta.status === 401
                ? 'Tu sesión venció. Vuelve a ingresar.'
                : respuesta.status === 403
                  ? 'No tienes permisos para crear usuarios.'
                  : 'No se pudo crear el usuario.'
        );
      }

      setDatos(inicial);
      setRol('DUENO_MASCOTA');
      onCreado();

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const campos: {
    nombre: keyof Campos;
    etiqueta: string;
    tipo?: string;
  }[] = [
    { nombre: 'rut', etiqueta: 'RUT (sin puntos ni guion)' },
    { nombre: 'nombre', etiqueta: 'Nombre' },
    { nombre: 'apellidos', etiqueta: 'Apellidos' },
    { nombre: 'correo', etiqueta: 'Correo', tipo: 'email' },
    { nombre: 'password', etiqueta: 'Contraseña', tipo: 'password' },
    { nombre: 'confirmarPassword', etiqueta: 'Confirmar contraseña', tipo: 'password' },
    { nombre: 'region', etiqueta: 'Región' },
    { nombre: 'comuna', etiqueta: 'Comuna' },
    { nombre: 'direccion', etiqueta: 'Dirección' }
  ];

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">

        <h4 className="mb-3">Crear nuevo usuario</h4>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={crearUsuario}>

          <div className="row g-3">
            {campos.map(campo => (
              <div
                className="col-12 col-md-6"
                key={campo.nombre}
              >
                <label className="form-label">
                  {campo.etiqueta}
                </label>

                <input
                  type={campo.tipo || 'text'}
                  className="form-control"
                  value={datos[campo.nombre]}
                  onChange={e =>
                    actualizar(campo.nombre, e.target.value)
                  }
                  minLength={
                    campo.tipo === 'password' ? 8 : undefined
                  }
                  maxLength={
                    campo.tipo === 'password' ? 72 : undefined
                  }
                  required
                />
              </div>
            ))}

            <div className="col-12">
              <label className="form-label">
                Rol del usuario
              </label>

              <select
                className="form-select"
                value={rol}
                onChange={e => setRol(e.target.value)}
              >
                <option value="DUENO_MASCOTA">
                  Dueño de mascota
                </option>
                <option value="RECEPCIONISTA">
                  Recepcionista
                </option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
