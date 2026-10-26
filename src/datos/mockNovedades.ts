import perrodientes from '../img/perrodientes.jpg';
import gatovacuna from '../img/gatovacuna.jpg';

export interface Novedad {
  id: string;
  titulo: string;
  fecha: string;
  resumen: string;
  contenidoDetallado: string;
  imagen: string;
}

export const novedadesIniciales: Novedad[] = [
  {
    id: "1",
    titulo: "Campaña de Vacunación Antirrábica 2024",
    fecha: "15 Octubre 2024",
    resumen: "Protege a tu mascota y a tu familia. Conoce los horarios y descuentos de nuestra campaña anual.",
    contenidoDetallado: "La rabia es una enfermedad viral mortal pero 100% prevenible. Durante todo este mes, en Veterinaria San Marcos estaremos realizando una campaña intensiva de vacunación antirrábica con un 20% de descuento. No necesitas agendar cita previa, solo acércate en nuestro horario de atención habitual. Recuerda traer el carnet de salud de tu mascota.",
    imagen: gatovacuna
  },
  {
    id: "2",
    titulo: "Consejos para el cuidado dental de tu perro",
    fecha: "02 Octubre 2024",
    resumen: "El sarro y la gingivitis pueden causar graves problemas de salud. Aprende a prevenir estas enfermedades.",
    contenidoDetallado: "La salud bucal de tu perro es fundamental para su bienestar general. Más del 80% de los perros mayores de 3 años padecen alguna enfermedad periodontal. Te recomendamos cepillar sus dientes al menos 3 veces por semana con pasta dental específica para mascotas, utilizar juguetes dentales y realizar una limpieza profesional (destartraje) una vez al año en nuestra clínica.",
    imagen: perrodientes
  }
];