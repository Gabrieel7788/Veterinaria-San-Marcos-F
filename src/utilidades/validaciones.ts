export const validarCorreo = (correo: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};

export const validarRut = (rutCompleto: string): boolean => {
  // Validar formato sin puntos ni guión (ej: 123456789)
  if (!/^[0-9]+[0-9kK]{1}$/.test(rutCompleto)) return false;
  
  const cuerpo = rutCompleto.slice(0, -1);
  const dv = rutCompleto.slice(-1).toUpperCase();
  
  let suma = 0;
  let multiplo = 2;
  
  for (let i = 1; i <= cuerpo.length; i++) {
    const index = multiplo * parseInt(rutCompleto.charAt(cuerpo.length - i));
    suma = suma + index;
    if (multiplo < 7) multiplo = multiplo + 1;
    else multiplo = 2;
  }
  
  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = dvEsperado.toString();
  if (dvEsperado === 11) dvCalculado = '0';
  if (dvEsperado === 10) dvCalculado = 'K';
  
  return dvCalculado === dv;
};