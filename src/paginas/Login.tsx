
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrupoInput } from '../componentes/moleculas/GrupoInput';
import { Boton } from '../componentes/atomos/Boton';
import { validarCorreo } from '../utilidades/validaciones';

interface RespuestaLogin {
  token: string;
  tipo: string;
  expiraEnSegundos: number;
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

export const Login = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setMensaje('');
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo es obligatorio.';
    } else if (!validarCorreo(formData.correo)) {
      nuevosErrores.correo = 'Correo inválido.';
    }

    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cargando || !validar()) return;

    setMensaje('');
    setCargando(true);

    try {
      const respuesta = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (respuesta.status === 401) {
        throw new Error('Correo o contraseña incorrectos.');
      }

      if (!respuesta.ok) {
        throw new Error('No se pudo iniciar sesión.');
      }

      const datos: RespuestaLogin = await respuesta.json();

      // Guardar la sesión temporalmente en esta pestaña.
      sessionStorage.setItem('tokenVet', datos.token);

      sessionStorage.setItem('usuarioVet', JSON.stringify({
        id: datos.id,
        nombre: datos.nombre,
        correo: datos.correo,
        rol: datos.rol
      }));

      // Limpiar una posible sesión simulada anterior.
      localStorage.removeItem('usuarioVet');

      // Volver al inicio y actualizar el Navbar.
      window.location.href = '/';

    } catch (error) {
      setMensaje(
        error instanceof TypeError
          ? 'No se pudo conectar con Spring Boot. Comprueba que esté encendido.'
          : error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0 bg-light p-4">

          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">
              🐾 Vet San Marcos
            </h2>
            <p className="text-muted">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {mensaje && (
            <div className="alert alert-danger" role="alert">
              {mensaje}
            </div>
          )}

          <form onSubmit={manejarEnvio} noValidate>

            <GrupoInput
              label="Correo electrónico"
              name="correo"
              type="email"
              maxLength={100}
              value={formData.correo}
              onChange={manejarCambio}
              mensajeError={errores.correo}
            />

            <GrupoInput
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={manejarCambio}
              mensajeError={errores.password}
            />

            <Boton
              type="submit"
              texto={cargando ? 'Ingresando...' : 'Ingresar'}
              disabled={cargando}
              className="w-100 mt-3"
            />

          </form>

          <div className="text-center mt-3">
            <small>
              ¿No tienes cuenta?{' '}
              <Link to="/registro">Regístrate aquí</Link>
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};
