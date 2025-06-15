export interface UbicacionesModel {
  id: number;
  descripcion: string;
  estado: number;
  username: string;
  m_Username: string;
  fecha_Hora: string; // ISO format date string
  m_Fecha_Hora: string | null;
  consecutivo_Interno: string;
}
