export interface CuentaBancariaModel {
  id: number;
  id_Banco: number;
  numero_Cuenta: string;
  descripcion: string;
  titular: string;
  estado: number;
  username: string;
  m_Username: string | null;
  fecha_Hora: string;
  m_Fecha_Hora: string | null;
  consecutivo_Interno: number;
}