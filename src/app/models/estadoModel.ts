export interface EstadosModel {
  id: number;
  descripcion: string;
  Disponible: boolean;
  username: string;
  m_Username: string;
  fecha_Hora: string; // ISO format date string
  m_Fecha_Hora: string | null;
  consecutivo_Interno: string;
}