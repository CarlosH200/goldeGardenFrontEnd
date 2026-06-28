export interface FormaPagoModel {
  id: number;
  descripcion: string;
  estado: number;
  username: string;
  m_Username: string | null;
  fecha_Hora: string;
  m_Fecha_Hora: string | null;
  consecutivo_Interno: number;
  icono: string | null;
  posee_Autorizarion: boolean;
  posee_Referencia: boolean;
  posee_Banco: boolean;
  posee_Cuenta_Bancaria: boolean;
}