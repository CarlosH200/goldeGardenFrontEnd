import { Estilos } from "../helpers/estilos";
import { DocumentoPDF } from "../interfaces/documento.interface";

export function CotizacionPDF(
        documento:DocumentoPDF
){
    return {

        pageSize:'LETTER',

        pageMargins:[40,40,40,50],

        content:[
             {
        text:'GOLDEN GARDEN',
        style:'titulo'
    }
        ],

        styles:Estilos

    };
}