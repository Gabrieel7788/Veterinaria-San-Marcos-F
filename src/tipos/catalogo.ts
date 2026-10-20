export interface Servicio {
  codigo: string;
  categoria: string;
  nombre: string;
  especie: string;
  duracion: string;
  precio: number;
  observaciones?: string;
}

export interface Medicamento {
  codigo: string;
  categoria: string;
  nombreComercial: string;
  principioActivo: string;
  presentacion: string;
  especie: string;
  stockActual: number;
  precioUnitario: number;
}