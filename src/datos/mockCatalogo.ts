import type { Servicio, Medicamento } from '../tipos/catalogo';

export const serviciosIniciales: Servicio[] = [
  {
    codigo: 'SV001',
    categoria: 'Consultas',
    nombre: 'Consulta general',
    especie: 'Perro / Gato',
    duracion: '30 min',
    precio: 15000,
    observaciones: ''
  },
  {
    codigo: 'SV002',
    categoria: 'Consultas',
    nombre: 'Consulta urgencia',
    especie: 'Perro / Gato',
    duracion: '30 min',
    precio: 25000,
    observaciones: 'Fuera de horario +$10.000'
  },
  {
    codigo: 'SV003',
    categoria: 'Consultas',
    nombre: 'Control postoperatorio',
    especie: 'Perro / Gato',
    duracion: '20 min',
    precio: 10000,
    observaciones: ''
  },
  {
    codigo: 'VA001',
    categoria: 'Vacunación',
    nombre: 'Vacuna antirrábica canina',
    especie: 'Perro',
    duracion: '10 min',
    precio: 12000,
    observaciones: 'Obligatoria por ley'
  },
  {
    codigo: 'VA003',
    categoria: 'Vacunación',
    nombre: 'Vacuna bivalente felina',
    especie: 'Gato',
    duracion: '10 min',
    precio: 15000,
    observaciones: 'Refuerzo anual'
  },
  {
    codigo: 'CI001',
    categoria: 'Cirugía',
    nombre: 'Esterilización hembra canina',
    especie: 'Perra',
    duracion: '90 min',
    precio: 80000,
    observaciones: 'Incluye anestesia y hospitalización 24h'
  },
  {
    codigo: 'EX001',
    categoria: 'Exámenes',
    nombre: 'Hemograma completo',
    especie: 'Perro / Gato',
    duracion: '30 min',
    precio: 22000,
    observaciones: 'Resultado en 24-48 h'
  },
  {
    codigo: 'OT002',
    categoria: 'Otros',
    nombre: 'Limpieza dental',
    especie: 'Perro / Gato',
    duracion: '45 min',
    precio: 55000,
    observaciones: 'Requiere anestesia'
  },
  {
    codigo: 'SV004',
    categoria: 'Consultas',
    nombre: 'Consulta ave / conejo',
    especie: 'Ave / Conejo',
    duracion: '30 min',
    precio: 18000
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