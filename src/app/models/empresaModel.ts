export interface EmpresaModel {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  redes: string;
  logoUrl: string;
  
  // Paleta de colores dinámica
  colorPrincipal: string;
  colorSecundario: string;
  colorTextoOscuro: string;
  colorTextoClaro: string;
}
