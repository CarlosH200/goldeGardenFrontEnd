export interface TransaccionModel {

  id?: number;

  id_cliente: number;

  id_evento?: number;

  id_producto?: number;

  tipo_Transaccion: number;

  monto: number;

  descripcion: string;

  username: string;

  observacion_01?: string;

  observacion_02?: string;

  cantidad?: number;
}