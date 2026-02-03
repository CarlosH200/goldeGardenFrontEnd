export interface ClienteModel {
  id?: number;

  nit: string;
  nombre: string;
  apellido: string;
  email: string;
  dpi: string;
  direccion: string;
  telefono: string;
  celular: string;
  tipoCliente: number;

  fechaRegistro?: string;
  observacion01?: string;
  observacion02?: string;
  estado?: number;

  username?: string;
  mUsername?: string;
  fechaHora?: string;
  mFechaHora?: string;

  consecutivoInterno?: number;
}
