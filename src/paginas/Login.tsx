import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GrupoInput } from '../componentes/moleculas/GrupoInput';
import { Boton } from '../componentes/atomos/Boton';
import { validarCorreo } from '../utilidades/validaciones';

export const Login = () => {
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState<Record<string, string>>({});

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    
    if (!formData.correo) nuevosErrores.correo = 'El correo es obligatorio.';
    else if (formData.correo.length > 100) nuevosErrores.correo = 'Máximo 100 caracteres.';
    else if (!validarCorreo(formData.correo)) nuevosErrores.correo = 'Formato de correo inválido.';

    if (!formData.password) nuevosErrores.password = 'La contraseña es obligatoria.';
    else if (formData.password.length < 4 || formData.password.length > 10) nuevosErrores.password = 'Debe tener entre 4 y 10 caracteres.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      const esAdmin = formData.correo.includes('admin');
      const usuario = { correo: formData.correo, rol: esAdmin ? 'admin' : 'cliente' };
      
      // Guardar sesión en el navegador
      localStorage.setItem('usuarioVet', JSON.stringify(usuario));
      
      alert(`Inicio de sesión exitoso como ${esAdmin ? 'Administrador' : 'Cliente'}`);
      window.location.href = '/'; // Recargamos para actualizar el Navbar
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm border-0 bg-light p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">🐾 Vet San Marcos</h2>
            <p className="text-muted">Inicia sesión en tu cuenta</p>
          </div>
          
          <form onSubmit={manejarEnvio}>
            <GrupoInput label="Correo electrónico" name="correo" type="email" maxLength={100} value={formData.correo} onChange={manejarCambio} mensajeError={errores.correo} />
            <GrupoInput label="Contraseña" name="password" type="password" maxLength={10} value={formData.password} onChange={manejarCambio} mensajeError={errores.password} />
            
            <Boton type="submit" texto="Ingresar" className="w-100 mt-3" />
          </form>
          <div className="text-center mt-3">
            <small>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
};