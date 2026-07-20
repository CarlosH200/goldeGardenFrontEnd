import { Injectable } from '@angular/core';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { TipoDocumento } from './enums/tipo-documento.enum';
import { DocumentoPDF } from './interfaces/documento.interface';

import { CotizacionPDF } from './formatos/cotizacion';
// 1. Importamos la función real desde el archivo del formato
import { generarContratoTemplate } from './formatos/contrato';
// Cargar fuentes
(pdfMake as any)["vfs"] = (pdfFonts as any)["vfs"];

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  imprimir(
    tipo: TipoDocumento,
    documento: DocumentoPDF | any
  ): void {

    let definition: any = null;

    switch (tipo) {

      case TipoDocumento.Cotizacion:
        definition = CotizacionPDF(documento);
        break;

      case TipoDocumento.Contrato:
        definition = generarContratoTemplate(documento);
        break;

      default:
        console.error('Tipo de documento no soportado.');
        return;
    }

    if (definition) {
      pdfMake.createPdf(definition).open();
    }
  }
}

function ContratoPDF(documento: any): any {
    throw new Error('Function not implemented.');
}
