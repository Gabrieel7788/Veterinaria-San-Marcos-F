import React from 'react';

interface PropsInput extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  tieneError?: boolean;
  esSelect?: boolean;
}

export const Input = ({ tieneError, esSelect, className = '', ...props }: PropsInput) => {
  const clases = `form-control ${tieneError ? 'is-invalid' : ''} ${className}`;
  
  if (esSelect) {
    return <select className={`form-select ${tieneError ? 'is-invalid' : ''} ${className}`} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)} />;
  }

  return <input className={clases} {...props} />;
};