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

  return (
    <div>
      <h2 className="mb-4">Administración (CRUD)</h2>
      
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