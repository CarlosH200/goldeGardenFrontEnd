// src/app/shared/pdf/templates/contrato.ts
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ESTILOS_GLOBALES, PALETA_COLORES } from '../helpers/estilos';

export function generarContratoTemplate(data: any): TDocumentDefinitions {
  return {
    pageSize: 'LETTER',
    pageMargins: [45, 45, 45, 50], // Márgenes limpios para aprovechar el espacio
    styles: ESTILOS_GLOBALES,
    
    // Pie de página dinámico (Página X de Y)
    footer: (currentPage: number, pageCount: number) => {
      return {
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 8,
        color: PALETA_COLORES.textoClaro,
        margin: [0, 20, 0, 0]
      };
    },

    content: [
      // ENCABEZADO CON LOGO Y DATOS DE LA EMPRESA (Estructura de Columnas)
      {
        columns: [
          {
            // Columna Izquierda: Nombre y detalles
            stack: [
              { text: 'GOLDEN GARDEN', style: 'headerEmpresa' },
              { text: 'JARDÍN DE EVENTOS', style: 'subHeaderEmpresa' },
              { text: '4ta. Avenida y 4ta. Calle, Barrio Asunción, Tecpán Guatemala, Chimaltenango', style: 'datosEmpresa' },
              { text: 'Contacto: 32861562 | Facebook: golden gardeen jardin de eventos', style: 'datosEmpresa' }
            ],
            width: '*'
          },
          {
            // Columna Derecha: Espacio decorativo o Logo
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 100, h: 40, r: 4, lineColor: PALETA_COLORES.secundario, lineWidth: 1 }
            ],
            width: 'auto',
            alignment: 'right'
          }
        ]
      },

      // Línea divisoria elegante
      { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 522, y2: 10, lineWidth: 1, lineColor: PALETA_COLORES.secundario }] },

      // TÍTULO E INSTRUCCIONES
      { text: 'CONTRATO DE ARRENDAMIENTO Y REGLAMENTO INTERNO', style: 'tituloDocumento' },
      {
        table: {
          widths: ['*'],
          body: [[{
            text: 'INSTRUCCIONES DE LLENADO: Este documento constituye un acuerdo contractual formal de cumplimiento obligatorio. Agradecemos completar todos los campos requeridos utilizando letra de molde legible y tinta indeleble.',
            style: 'instrucciones'
          }]]
        },
        layout: 'noBorders',
        fillColor: PALETA_COLORES.fondoGris
      },

      // INTRODUCCIÓN LEGAL
      {
        text: [
          { text: `En el municipio de Tecpán Guatemala, departamento de Chimaltenango, el día ` },
          { text: `${data.dia || '______'}`, bold: true },
          { text: ` de ` },
          { text: `${data.mes || '__________________'}`, bold: true },
          { text: ` de 20${data.anio || '__'} , comparecen por una parte el/la arrendante quien se identifica como ` },
          { text: `${data.representante || '____________________________________________'}`, bold: true },
          { text: ` en representación administrativa de Golden Garden (denominado en adelante como "El Arrendador") y por la otra parte el cliente cuyos datos de identificación civil se detallan a continuación (denominado en adelante como "El Arrendatario"):` }
        ],
        style: 'textoCuerpo',
        margin: [0, 5, 0, 10]
      },

      // SECCIÓN I: DATOS DEL ARRENDATARIO Y LOGÍSTICA (Estructura en Tabla Limpia)
      { text: 'SECCIÓN I: DATOS DEL ARRENDATARIO Y LOGÍSTICA', style: 'seccionTitulo' },
      {
        table: {
          widths: [90, '*', 90, '*'],
          body: [
            [
              { text: 'Nombre del Cliente:', bold: true, style: 'tablaTexto' },
              { text: data.clienteNombre || '', style: 'tablaTexto', colSpan: 3 }, {}, {}
            ],
            [
              { text: 'DPI / CUI Número:', bold: true, style: 'tablaTexto' },
              { text: data.clienteDpi || '', style: 'tablaTexto' },
              { text: 'Edad / Est. Civil:', bold: true, style: 'tablaTexto' },
              { text: data.clienteEdadEstado || '', style: 'tablaTexto' }
            ],
            [
              { text: 'Teléfono(s):', bold: true, style: 'tablaTexto' },
              { text: data.clienteTelefono || '', style: 'tablaTexto' },
              { text: 'Correo:', bold: true, style: 'tablaTexto' },
              { text: data.clienteCorreo || '', style: 'tablaTexto' }
            ],
            [
              { text: 'Tipo de Evento:', bold: true, style: 'tablaTexto' },
              { text: data.eventoTipo || '', style: 'tablaTexto' },
              { text: 'No. de Invitados:', bold: true, style: 'tablaTexto' },
              { text: data.eventoInvitados || '', style: 'tablaTexto' }
            ],
            [
              { text: 'Fecha del Evento:', bold: true, style: 'tablaTexto' },
              { text: data.eventoFecha || '', style: 'tablaTexto' },
              { text: 'Horario Contratado:', bold: true, style: 'tablaTexto' },
              { text: data.eventoHorario || '', style: 'tablaTexto' }
            ]
          ]
        },
        layout: {
          hLineWidth: (i) => i === 0 || i === 5 ? 1 : 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => PALETA_COLORES.lineas,
          vLineColor: () => PALETA_COLORES.lineas
        }
      },

      // TABLA DE PRECIOS Y MONTOS
      { text: '', margin: [0, 10] },
      {
        table: {
          widths: ['*', 180],
          body: [
            [
              { text: 'CONCEPTO DETALLADO', style: 'tablaEncabezado', alignment: 'left' },
              { text: 'MONTO EN QUETZALES (Q.)', style: 'tablaEncabezado', alignment: 'right' }
            ],
            [
              { text: 'Precio Total del Arrendamiento:', style: 'tablaTexto', bold: true },
              { text: data.montoTotal ? `Q. ${data.montoTotal}` : 'Q.', style: 'tablaTexto', alignment: 'right' }
            ],
            [
              { text: 'Anticipo de Reserva (50% Obligatorio):', style: 'tablaTexto' },
              { text: data.montoAnticipo ? `Q. ${data.montoAnticipo}` : 'Q.', style: 'tablaTexto', alignment: 'right' }
            ],
            [
              { text: 'Saldo Pendiente (50% a liquidar el día del evento):', style: 'tablaTexto' },
              { text: data.montoSaldo ? `Q. ${data.montoSaldo}` : 'Q.', style: 'tablaTexto', alignment: 'right' }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => PALETA_COLORES.primario,
          vLineColor: () => PALETA_COLORES.primario
        }
      },

      // CLÁUSULAS ADICIONALES DE LA SECCIÓN I
      {
        text: [
          { text: '\n• Condiciones de Pago (50/50): ', bold: true }, 'La fecha se reserva formalmente únicamente tras el abono del 50% del total. El 50% restante deberá liquidarse estrictamente el día del evento al recibir físicamente las instalaciones.\n',
          { text: '• Infraestructura Incluida: ', bold: true }, 'El monto pactado concede el derecho de uso del área techada, áreas verdes (jardines), de manera complementaria el uso de estacionamiento propio (no vigilado, quedando bajo estricta responsabilidad de los propietarios) y servicios básicos (agua potable, energía comercial, sanitarios y planta eléctrica de soporte).\n',
          { text: '• Responsabilidad Civil Absoluta: ', bold: true }, 'El Arrendatario asume total responsabilidad legal por cualquier eventualidad, daño, accidente o riesgo ocurrido en el establecimiento durante la vigencia de este contrato, ya sea provocado por sí mismo, sus invitados, familiares o por los proveedores externos que contrate (catering, discotecas, mobiliario externo, etc.).'
        ],
        style: 'textoCuerpo',
        margin: [0, 8, 0, 0]
      },

      // Salto de página forzado para iniciar el reglamento con orden profesional
      { text: '', pageBreak: 'before' },

      // SECCIÓN II: REGLAMENTO INTERNO
      { text: 'SECCIÓN II: REGLAMENTO Y NORMAS DEL ESTABLECIMIENTO', style: 'seccionTitulo' },
      
      {
        ol: [
          { text: 'Horarios y Penalizaciones: En eventos nocturnos, la hora máxima permitida de finalización son las 12:00 AM (Medianoche). A partir de ese momento se otorga de manera estricta una (1) hora adicional exclusiva para limpieza y desmontaje. Cada hora o fracción excedente devengará un recargo obligatorio de Q. 300.00.', style: 'reglamentoTexto' },
          { text: 'Regulación de Audio (Norma Vecinal): En cumplimiento estricto con las disposiciones de la organización vecinal del sector y normativas municipales de Tecpán Guatemala, el volumen de la música (DJs, bandas o bocinas) deberá moderarse obligatoriamente a partir de las 10:30 PM, y apagarse en su totalidad a las 12:00 AM.', style: 'reglamentoTexto' },
          { text: 'Higiene y Manejo de Basura: El lugar se entrega limpio y en óptimas condiciones, por lo que debe devolverse exactamente igual. El Arrendatario tiene la obligación estricta de retirar y llevarse la basura fuera de las instalaciones al concluir. En caso de no poder o no desear realizarlo, puede delegarlo contratando el servicio interno de limpieza por una tarifa fija de Q. 300.00.', style: 'reglamentoTexto' },
          { text: 'Protección Estructural y Decoración: Queda estrictamente prohibido el uso de clavos, grapas, tachuelas, adhesivos industriales o materiales que perforen, manchen o deterioren las paredes, columnas o acabados arquitectónicos del inmueble.', style: 'reglamentoTexto' },
          { text: 'Mobiliario y Servicios Adicionales: Golden Garden ofrece de forma complementaria servicios profesionales de mobiliario y decoración. Todo daño, quiebre o extravío de los bienes provistos deberá ser resarcido por el cliente pagando el valor comercial real del objeto o sustituyéndolo por uno exactamente igual.', style: 'reglamentoTexto' },
          { text: 'Seguridad y Deslindamiento de Responsabilidad en Estacionamiento: Se prohíbe de forma terminante el ingreso de cualquier tipo de armas de fuego o armas blancas, así como el consumo o posesión de sustancias ilícitas. Asimismo, se hace constar que el uso del estacionamiento propio va incluido en el paquete, pero no cuenta con servicio de vigilancia, por lo que todo vehículo estacionado y los objetos de valor dejados en su interior quedan bajo la estricta y absoluta responsabilidad de sus propietarios.', style: 'reglamentoTexto' }
        ]
      },

      // SOPORTE Y CIERRE
      { text: '\nSOPORTE Y ATENCIÓN DIRECTA:', bold: true, color: PALETA_COLORES.primario, fontSize: 10, margin: [0, 15, 0, 4] },
      { text: 'Ante cualquier duda, requerimiento logístico o eventualidad técnica durante el evento, por favor diríjase de inmediato al personal de Golden Garden asignado en las instalaciones, o comuníquese con prioridad al teléfono corporativo 32861562.', style: 'textoCuerpo' },

      { text: '\nEn señal de plena conformidad y aceptación de cada una de las cláusulas y normas aquí descritas, ambas partes firman el presente acuerdo extendido en dos ejemplares de igual validez.\n\n', style: 'textoCuerpo', margin: [0, 10, 0, 40] },

      // ÁREA DE FIRMAS (Columnas balanceadas)
      {
        columns: [
          {
            stack: [
              { canvas: [{ type: 'line', x1: 20, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: PALETA_COLORES.textoOscuro }] },
              { text: '\nPor Golden Garden\nEl Arrendador', style: 'firmaTexto' }
            ],
            width: '*'
          },
          {
            stack: [
              { canvas: [{ type: 'line', x1: 20, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: PALETA_COLORES.textoOscuro }] },
              { text: '\nFirma del Cliente\nEl Arrendatario', style: 'firmaTexto' }
            ],
            width: '*'
          }
        ]
      }
    ]
  };
}