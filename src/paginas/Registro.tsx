import { useState } from 'react';
import { GrupoInput } from '../componentes/moleculas/GrupoInput';
import { Boton } from '../componentes/atomos/Boton';
import { validarCorreo, validarRut } from '../utilidades/validaciones';
import { regionesComunas, opcionesRegiones } from '../datos/geografia';

export const Registro = () => {
  const [formData, setFormData] = useState({
    rut: '', nombre: '', apellidos: '', correo: '', fechaNacimiento: '', 
    tipoUsuario: 'Cliente', region: '', comuna: '', direccion: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [opcionesComunas, setOpcionesComunas] = useState<{valor: string, texto: string}[]>([]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'region') {
      const comunas = regionesComunas[value] || [];
      setOpcionesComunas(comunas.map(c => ({ valor: c, texto: c })));
      setFormData(prev => ({ ...prev, region: value, comuna: '' })); // Reset comuna al cambiar región
    }
  };

  const validar = () => {
    const e: Record<string, string> = {};
    if (!formData.rut) e.rut = 'El RUT es obligatorio.';
    else if (!validarRut(formData.rut)) e.rut = 'RUT inválido. Ingrese sin puntos ni guión (Ej: 123456789).';
    
    if (!formData.nombre) e.nombre = 'El nombre es obligatorio.';
    else if (formData.nombre.length > 50) e.nombre = 'Máximo 50 caracteres.';
    
    if (!formData.apellidos) e.apellidos = 'Los apellidos son obligatorios.';
    else if (formData.apellidos.length > 100) e.apellidos = 'Máximo 100 caracteres.';
    
    if (!formData.correo) e.correo = 'El correo es obligatorio.';
    else if (formData.correo.length > 100) e.correo = 'Máximo 100 caracteres.';
    else if (!validarCorreo(formData.correo)) e.correo = 'Formato inválido.';
    
    if (!formData.region) e.region = 'Debes seleccionar una región.';
    if (!formData.comuna) e.comuna = 'Debes seleccionar una comuna.';
    
    if (!formData.direccion) e.direccion = 'La dirección es obligatoria.';
    else if (formData.direccion.length > 300) e.direccion = 'Máximo 300 caracteres.';

    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) alert('Usuario registrado exitosamente (Simulado)');
  };

  return (
    <div className="card shadow-sm border-0 bg-light p-4 mx-auto" style={{ maxWidth: '800px' }}>
      <h3 className="mb-4 text-primary text-center">Registro de Usuario</h3>
      <form onSubmit={manejarEnvio} className="row">
        <div className="col-md-6"><GrupoInput label="RUT (Sin puntos ni guión)" name="rut" value={formData.rut} onChange={manejarCambio} mensajeError={errores.rut} /></div>
        <div className="col-md-6"><GrupoInput label="Tipo de Usuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={manejarCambio} esSelect opciones={[{valor: 'Cliente', texto: 'Dueño de mascota'}, {valor: 'Admin', texto: 'Administrador'}]} /></div>
        <div className="col-md-6"><GrupoInput label="Nombres" name="nombre" value={formData.nombre} onChange={manejarCambio} mensajeError={errores.nombre} /></div>
        <div className="col-md-6"><GrupoInput label="Apellidos" name="apellidos" value={formData.apellidos} onChange={manejarCambio} mensajeError={errores.apellidos} /></div>
        <div className="col-md-6"><GrupoInput label="Correo electrónico" name="correo" type="email" value={formData.correo} onChange={manejarCambio} mensajeError={errores.correo} /></div>
        <div className="col-md-6"><GrupoInput label="Fecha de Nacimiento (Opcional)" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={manejarCambio} /></div>
        <div className="col-md-6"><GrupoInput label="Región" name="region" value={formData.region} onChange={manejarCambio} esSelect opciones={opcionesRegiones} mensajeError={errores.region} /></div>
        <div className="col-md-6"><GrupoInput label="Comuna" name="comuna" value={formData.comuna} onChange={manejarCambio} esSelect opciones={opcionesComunas} mensajeError={errores.comuna} disabled={!formData.region} /></div>
        <div className="col-12"><GrupoInput label="Dirección" name="direccion" value={formData.direccion} onChange={manejarCambio} mensajeError={errores.direccion} /></div>
        <div className="col-12 text-end mt-3"><Boton type="submit" texto="Registrar Usuario" /></div>
      </form>
    </div>
  );
};