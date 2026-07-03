export interface BancoModel {
  id: number;
  descripcion: string;
  estado: number;
  username: string;
  m_Username: string | null;
  fecha_Hora: string;
  m_Fecha_Hora: string | null;
  consecutivo_Interno: number;
}