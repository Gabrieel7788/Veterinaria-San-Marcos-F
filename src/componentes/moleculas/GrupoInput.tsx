import { Input } from '../atomos/Input';

interface PropsGrupoInput extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  mensajeError?: string;
  esSelect?: boolean;
  opciones?: { valor: string; texto: string }[];
}

export const GrupoInput = ({ label, mensajeError, esSelect, opciones, ...props }: PropsGrupoInput) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">{label}</label>
      
      {esSelect && opciones ? (
        <Input esSelect tieneError={!!mensajeError} {...props}>
          <option value="">Seleccione una opción...</option>
          {opciones.map((opc) => (
            <option key={opc.valor} value={opc.valor}>
              {opc.texto}
            </option>
          ))}
        </Input>
      ) : (
        <Input tieneError={!!mensajeError} {...props} />
      )}
      
      {mensajeError && <div className="invalid-feedback d-block">{mensajeError}</div>}
    </div>
  );
};