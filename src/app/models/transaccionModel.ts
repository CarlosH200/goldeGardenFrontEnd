export interface TransaccionModel {

  id: number;

  id_cliente: number;

  id_evento: number;

  id_producto: number;

  tipo_Transaccion: number;

  monto: number;

  descripcion: string;

  fecha_Transaccion: string;

  estado: number;

  username: string;

  m_Username: string;

  fecha_Hora: string;

  m_Fecha_Hora: string | null;

  consecutivo_Interno: number;

  observacion_01: string;

  observacion_02: string;

  cantidad: number;
}