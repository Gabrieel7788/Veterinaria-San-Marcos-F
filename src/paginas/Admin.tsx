import { useState } from 'react';
import { TablaDatos } from '../componentes/organismos/TablaDatos';
import { FormularioServicio } from '../componentes/organismos/FormularioServicio';
import { serviciosIniciales } from '../datos/mockCatalogo';
import type { Servicio } from '../tipos/catalogo';

export const Admin = () => {
  const [servicios, setServicios] = useState<Servicio[]>(serviciosIniciales);
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);

  // Crear o Actualizar
  const guardarServicio = (servicio: Servicio) => {
    if (servicioAEditar) {
      setServicios(servicios.map(s => s.codigo === servicio.codigo ? servicio : s));
      setServicioAEditar(null);
    } else {
      setServicios([...servicios, servicio]);
    }
  };

  // Eliminar
  const eliminarServicio = (codigo: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      setServicios(servicios.filter(s => s.codigo !== codigo));
    }
  };

  // Verificar permisos
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioVet') || 'null');
  
  if (!usuarioActual || usuarioActual.rol !== 'admin') {
    return (
      <div className="alert alert-danger mt-5 text-center shadow-sm p-5 border-0">
        <h2 className="alert-heading text-danger fw-bold">🚫 Acceso Denegado</h2>
        <p className="lead">Esta área es exclusiva para el personal administrativo.</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="mb-4">Administración</h2>
      
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
  );
};