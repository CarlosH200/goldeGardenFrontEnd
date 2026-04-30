export interface ClienteModel {
  id: number;
  nit: string;
  nombre: string;
  apellido: string;
  email: string;
  dpi: string;
  direccion: string;
  telefono: string;
  celular: string;
  tipoCliente: number;

  fecha_Registro: string;

  observacion01: string;
  observacion02: string;

  estado: number;

  username: string;
  m_Username: string;

  fecha_Hora: string;
  m_Fecha_Hora: string | null;

  consecutivo_Interno: number;
}