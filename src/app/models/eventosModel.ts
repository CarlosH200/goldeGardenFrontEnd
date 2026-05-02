export interface EventosModel {
  id: number;

  titulo: string;
  descripcion: string;

  fecha_Ini: string;
  fecha_Fin: string;
  fecha_Entrega: string;
  fecha_Recepcion: string;

  ubicacion: number;
  organizador: number;
  tipo_Evento: number;

  capacidad_Evento: number;

  Observacion: string;

  url_Evento: string;

  estado: number;

  username: string;

  m_Username: string;

  fecha_Hora: string;
  
  m_Fecha_Hora: string | null;

  consecutivo_Interno: number;

  id_cliente: number;

  // 🔗 descriptivos
  ubicacion_Nombre: string;
  organizador_Nombre: string;
  tipo_Evento_Descripcion: string;
  estado_Descripcion: string;
}