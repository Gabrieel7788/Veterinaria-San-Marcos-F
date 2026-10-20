import { useState, useEffect } from 'react';
import { GrupoInput } from '../moleculas/GrupoInput';
import { Boton } from '../atomos/Boton';
import type { Servicio } from '../../tipos/catalogo';

interface PropsFormulario {
  servicioAEditar: Servicio | null;
  alGuardar: (servicio: Servicio) => void;
  alCancelar: () => void;
}

export const FormularioServicio = ({ servicioAEditar, alGuardar, alCancelar }: PropsFormulario) => {
  const [formData, setFormData] = useState<Servicio>({
    codigo: '', categoria: '', nombre: '', especie: '', duracion: '', precio: 0, observaciones: ''
  });
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    if (servicioAEditar) setFormData(servicioAEditar);
    else setFormData({ codigo: '', categoria: '', nombre: '', especie: '', duracion: '', precio: 0, observaciones: '' });
  }, [servicioAEditar]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'precio' ? Number(value) : value });
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    if (!formData.codigo.trim()) nuevosErrores.codigo = 'El código es obligatorio.';
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.categoria) nuevosErrores.categoria = 'Seleccione una categoría.';
    if (formData.precio <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0.';
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    if (validar()) {
      alGuardar(formData);
      setFormData({ codigo: '', categoria: '', nombre: '', especie: '', duracion: '', precio: 0, observaciones: '' });
      setErrores({});
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="card p-4 shadow-sm mb-4 border-0 bg-light">
      <h4 className="mb-3 text-primary">{servicioAEditar ? 'Editar Servicio' : 'Nuevo Servicio'}</h4>
      <div className="row">
        <div className="col-md-3">
          <GrupoInput label="Código" name="codigo" value={formData.codigo} onChange={manejarCambio} mensajeError={errores.codigo} disabled={!!servicioAEditar} />
        </div>
        <div className="col-md-5">
          <GrupoInput label="Nombre" name="nombre" value={formData.nombre} onChange={manejarCambio} mensajeError={errores.nombre} />
        </div>
        <div className="col-md-4">
          <GrupoInput label="Categoría" name="categoria" value={formData.categoria} onChange={manejarCambio} mensajeError={errores.categoria} esSelect opciones={[{ valor: 'Consultas', texto: 'Consultas' }, { valor: 'Cirugía', texto: 'Cirugía' }, { valor: 'Exámenes', texto: 'Exámenes' }]} />
        </div>
        <div className="col-md-4">
          <GrupoInput label="Precio ($)" name="precio" type="number" value={formData.precio || ''} onChange={manejarCambio} mensajeError={errores.precio} />
        </div>
        <div className="col-md-4">
          <GrupoInput label="Especie" name="especie" value={formData.especie} onChange={manejarCambio} />
        </div>
        <div className="col-md-4">
          <GrupoInput label="Duración" name="duracion" value={formData.duracion} onChange={manejarCambio} />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        {servicioAEditar && <Boton type="button" variante="secondary" texto="Cancelar" onClick={alCancelar} />}
        <Boton type="submit" variante="success" texto="Guardar Registro" />
      </div>
    </form>
  );
};