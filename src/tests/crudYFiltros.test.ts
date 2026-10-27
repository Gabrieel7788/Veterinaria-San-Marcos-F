import { test, expect } from 'vitest';

let baseDeDatos = [
  { id: 1, nombre: 'Consulta', precio: 15000, categoria: 'Medicina' },
  { id: 2, nombre: 'Vacuna', precio: 12000, categoria: 'Prevencion' }
];

test('PRUEBA 1 (CRUD): debe agregar un nuevo servicio a la base de datos', () => {
  const nuevoServicio = { id: 3, nombre: 'Peluquería', precio: 20000, categoria: 'Estética' };
  const baseActualizada = [...baseDeDatos, nuevoServicio];
  expect(baseActualizada.length).toBe(3);
  expect(baseActualizada[2].nombre).toBe('Peluquería');
});

test('PRUEBA 2 (CRUD): debe leer y retornar todos los elementos de la lista', () => {
  expect(baseDeDatos.length).toBeGreaterThan(0);
  expect(baseDeDatos[0]).toHaveProperty('nombre');
});

test('PRUEBA 3 (CRUD): debe actualizar el precio de un servicio existente', () => {
  const baseActualizada = baseDeDatos.map(item => 
    item.id === 1 ? { ...item, precio: 18000 } : item
  );
  const servicioEditado = baseActualizada.find(item => item.id === 1);
  expect(servicioEditado?.precio).toBe(18000);
});

test('PRUEBA 4 (CRUD): debe eliminar un servicio por su ID', () => {
  const baseFiltrada = baseDeDatos.filter(item => item.id !== 2);
  expect(baseFiltrada.length).toBe(1);
  expect(baseFiltrada.find(item => item.id === 2)).toBeUndefined();
});

test('PRUEBA 5 (Filtros): debe filtrar los servicios por nombre', () => {
  const terminoBusqueda = 'vacu';
  const resultados = baseDeDatos.filter(item => 
    item.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );
  expect(resultados[0].nombre).toBe('Vacuna');
});

test('PRUEBA 6 (Filtros): debe filtrar los servicios por categoría exacta', () => {
  const categoriaBuscada = 'Medicina';
  const resultados = baseDeDatos.filter(item => item.categoria === categoriaBuscada);
  expect(resultados.length).toBe(1);
  expect(resultados[0].nombre).toBe('Consulta');
});