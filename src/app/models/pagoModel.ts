export interface PagoModel {

  id: number;

  id_evento: number;

  id_cliente: number;

  id_forma_pago: number;

  monto_Pagado: number;

  monto_Total: number;

  saldo_Pendiente: number;

  descripcion: string;

  fecha_Pago: string;

  estado: number;

  username: string;

  m_Username: string;

  fecha_Hora: string;

  m_Fecha_Hora: string | null;

  consecutivo_Interno: number;

  id_Tipo_Movimiento: number;

  referencia: string;

  autorizacion: string;

  id_Banco: number;

  id_Cuenta_Bancaria: number;

  // descriptivos

  forma_Pago: string;

  tipo_Movimiento: string;

  banco: string;

  cuenta_Bancaria: string;

  estado_Descripcion: string;

}