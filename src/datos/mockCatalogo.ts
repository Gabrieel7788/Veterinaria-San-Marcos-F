import type { Servicio, Medicamento } from '../tipos/catalogo';

export const serviciosIniciales: Servicio[] = [
  {
    codigo: 'SV001',
    categoria: 'Consultas',
    nombre: 'Consulta general',
    especie: 'Perro / Gato',
    duracion: '30 min',
    precio: 15000
  },
  {
    codigo: 'SV002',
    categoria: 'Consultas',
    nombre: 'Consulta urgencia',
    especie: 'Perro / Gato',
    duracion: '30 min',
    precio: 25000,
    observaciones: 'Fuera de horario +$10.000'
  }
];

export const medicamentosIniciales: Medicamento[] = [
  {
    codigo: 'ME001',
    categoria: 'Antibióticos',
    nombreComercial: 'Amoxibay 250mg',
    principioActivo: 'Amoxicilina',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stockActual: 45,
    precioUnitario: 4200
  },
  {
    codigo: 'ME002',
    categoria: 'Antibióticos',
    nombreComercial: 'Enrox 50mg',
    principioActivo: 'Enrofloxacino',
    presentacion: 'Blíster 10 comp.',
    especie: 'Perro / Gato',
    stockActual: 30,
    precioUnitario: 6800
  }
];