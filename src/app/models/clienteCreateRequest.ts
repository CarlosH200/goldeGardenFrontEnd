export interface ClienteCreateRequest {
  nit: string;
  nombre: string;
  apellido: string;
  email: string;
  dpi: string;
  direccion: string;
  telefono: string;
  celular: string;
  tipoCliente: number;

  observacion01?: string;
  observacion02?: string;

  username: string;
}
