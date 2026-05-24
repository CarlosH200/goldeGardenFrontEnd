export interface ProductoModel {

  id: number;

  codigo: string;

  descripcion: string;

  descripcion_Alterna: string;

  precio_Venta: number;

  cantidad: number;

  ultimo_Costo: number;

  tipo_Producto: number;

  tipo_Precio: number;

  categoria: number;

  estado: number;

  username: string;

  m_Username: string;

  fecha_Hora: string;

  m_Fecha_Hora: string | null;

  consecutivo_Interno: number;
}