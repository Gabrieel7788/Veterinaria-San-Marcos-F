import { Boton } from '../atomos/Boton';

interface PropsTabla {
  columnas: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datos: any[];
  alEditar: (item: any) => void;
  alEliminar: (codigo: string) => void;
}

export const TablaDatos = ({ columnas, datos, alEditar, alEliminar }: PropsTabla) => {
  if (datos.length === 0) {
    return <div className="alert alert-info">No hay registros para mostrar.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            {columnas.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, index) => (
            <tr key={index}>
              {/* Renderizamos dinámicamente las celdas según los datos que lleguen */}
              {columnas.map((col, colIndex) => (
                <td key={colIndex}>{fila[col.toLowerCase()] || fila.nombre || fila.codigo}</td>
              ))}
              <td>
                <Boton variante="warning" texto="Editar" className="me-2 btn-sm" onClick={() => alEditar(fila)} />
                <Boton variante="danger" texto="Eliminar" className="btn-sm" onClick={() => alEliminar(fila.codigo)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};