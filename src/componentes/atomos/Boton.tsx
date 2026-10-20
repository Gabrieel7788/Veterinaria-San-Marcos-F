import React from 'react';

interface PropsBoton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'outline-danger' | 'outline-primary';
  texto: string;
}
export const Boton = ({ variante = 'primary', texto, className = '', ...props }: PropsBoton) => {
  return (
    <button className={`btn btn-${variante} ${className}`} {...props}>
      {texto}
    </button>
  );
};