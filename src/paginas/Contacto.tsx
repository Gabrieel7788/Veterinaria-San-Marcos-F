import { useState } from 'react';
import { GrupoInput } from '../componentes/moleculas/GrupoInput';
import { Boton } from '../componentes/atomos/Boton';
import { validarCorreo } from '../utilidades/validaciones';

export const Contacto = () => {
  const [formData, setFormData] = useState({ nombre: '', correo: '', comentario: '' });
  const [errores, setErrores] = useState<Record<string, string>>({});

const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const validar = () => {
    const e: Record<string, string> = {};
    
    if (!formData.nombre) e.nombre = 'El nombre es obligatorio.';
    else if (formData.nombre.length > 100) e.nombre = 'Máximo 100 caracteres.';
    
    if (formData.correo) {
      if (formData.correo.length > 100) e.correo = 'Máximo 100 caracteres.';
      else if (!validarCorreo(formData.correo)) e.correo = 'Formato de correo inválido.';
    }
    
    if (!formData.comentario) e.comentario = 'El comentario es obligatorio.';
    else if (formData.comentario.length > 500) e.comentario = 'Máximo 500 caracteres.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      alert('Mensaje enviado correctamente (Simulado)');
      setFormData({ nombre: '', correo: '', comentario: '' }); // Limpiar formulario
    }
  };

  return (
    <div className="row justify-content-center mt-4">
      <div data-testid="contenedor-responsivo" className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0 bg-light p-4">
          <h2 className="text-primary mb-4 text-center">Contáctanos</h2>
          <form onSubmit={manejarEnvio}>
            <GrupoInput label="Nombre completo" name="nombre" maxLength={100} value={formData.nombre} onChange={manejarCambio} mensajeError={errores.nombre} />
            <GrupoInput label="Correo electrónico (Opcional)" name="correo" type="email" maxLength={100} value={formData.correo} onChange={manejarCambio} mensajeError={errores.correo} />
            
            <div className="mb-3">
              <label className="form-label fw-bold">Comentario o Mensaje</label>
              <textarea 
                className={`form-control ${errores.comentario ? 'is-invalid' : ''}`} 
                name="comentario" 
                rows={4} 
                maxLength={500}
                value={formData.comentario} 
                onChange={manejarCambio}
              ></textarea>
              {errores.comentario && <div className="invalid-feedback d-block">{errores.comentario}</div>}
              <div className="form-text text-end">{formData.comentario.length}/500</div>
            </div>
            
            <Boton type="submit" texto="Enviar Mensaje" className="w-100" />
          </form>
        </div>
      </div>
    </div>
  );
};