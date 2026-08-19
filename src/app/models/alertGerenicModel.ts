// Estructura de datos para la reutilización
export interface AlertGenericModel {
  titulo: string;   // Título principal del diálogo
  mensaje: string;  // Mensaje principal a mostrar
  tipo: 'success' | 'error' | 'info' | 'warning'; // Tipo de alerta
  detalles?: { etiqueta: string; valor: any }[];  // Información adicional opcional
  icon?: string;    // Icono representativo del tipo de alerta

  // 🔹 NUEVO: flag para decidir si se muestran botones de confirmación
  mostrarBotones?: boolean; 
}
