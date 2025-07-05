export interface CapacidadesModel {
  id: number;
  descripcion: string;
  cantidad: number;
  estado: number;
  username: string;
  m_Username: string;
  fecha_Hora: string; // formato ISO
  m_Fecha_Hora: string | null;
  consecutivo_Interno: string;
}
