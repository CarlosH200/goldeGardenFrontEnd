export const Estilos={

titulo:{},

subtitulo:{},

texto:{},

tablaHeader:{},

tablaTexto:{},

totales:{},

footer:{}

}

// src/app/shared/pdf/estilos.ts

export const PALETA_COLORES = {
  primario: '#1a2e1a',    // Verde bosque profundo (Elegante para Golden Garden)
  secundario: '#c5a059',  // Dorado / Ocre corporativo
  textoOscuro: '#222222', // Gris casi negro legible
  textoClaro: '#777777',  // Gris para subtítulos/líneas
  fondoGris: '#f9f9f9',   // Para tablas alternas o secciones
  lineas: '#e0e0e0'
};

export const ESTILOS_GLOBALES = {
  headerEmpresa: { fontSize: 18, bold: true, color: PALETA_COLORES.primario, margin: [0, 0, 0, 2] as [number, number, number, number] },
  subHeaderEmpresa: { fontSize: 9, bold: true, color: PALETA_COLORES.secundario, letterSpacing: 1 },
  datosEmpresa: { fontSize: 8, color: PALETA_COLORES.textoClaro, margin: [0, 2, 0, 0] as [number, number, number, number] },
  tituloDocumento: { fontSize: 14, bold: true, color: PALETA_COLORES.primario, alignment: 'center' as const, margin: [0, 15, 0, 5] as [number, number, number, number] },
  instrucciones: { fontSize: 8, italic: true, color: PALETA_COLORES.textoOscuro, margin: [0, 5, 0, 15] as [number, number, number, number] },
  textoCuerpo: { fontSize: 9.5, color: PALETA_COLORES.textoOscuro, leadingLines: 1.25, alignment: 'justify' as const },
  seccionTitulo: { fontSize: 11, bold: true, color: PALETA_COLORES.primario, margin: [0, 15, 0, 8] as [number, number, number, number] },
  tablaEncabezado: { fontSize: 9, bold: true, color: '#ffffff', fillColor: PALETA_COLORES.primario, margin: [0, 4, 0, 4] as [number, number, number, number] },
  tablaTexto: { fontSize: 9, color: PALETA_COLORES.textoOscuro, margin: [0, 3, 0, 3] as [number, number, number, number] },
  reglamentoTexto: { fontSize: 9, color: PALETA_COLORES.textoOscuro, margin: [0, 0, 0, 6] as [number, number, number, number], leadingLines: 1.2, alignment: 'justify' as const },
  firmaTexto: { fontSize: 9, bold: true, color: PALETA_COLORES.textoOscuro, alignment: 'center' as const }
};