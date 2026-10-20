export const regionesComunas: Record<string, string[]> = {
  "Región Metropolitana": ["Santiago", "Providencia", "Maipú", "Puente Alto"],
  "Valparaíso": ["Viña del Mar", "Valparaíso", "Quilpué"],
  "O'Higgins": ["Rancagua", "Machalí", "San Fernando"]
};

export const opcionesRegiones = Object.keys(regionesComunas).map(r => ({ valor: r, texto: r }));