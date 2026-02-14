// Estructura de datos para la reutilización
export interface AlertGenericModel {
  titulo: string;
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
  detalles?: { etiqueta: string; valor: any }[];
  icon: string; // Icono representativo del tipo de alerta
}