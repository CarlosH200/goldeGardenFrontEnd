import { DocumentoPDF } from "../interfaces/documento.interface";

export function CotizacionPDF(documento: DocumentoPDF) {
  const fechaInicio = documento.evento?.fechaInicio
    ? new Date(documento.evento.fechaInicio).toLocaleDateString('es-GT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const fechaFin = documento.evento?.fechaFin
    ? new Date(documento.evento.fechaFin).toLocaleDateString('es-GT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const fecha = fechaInicio || fechaFin || '';

  const items = documento.productos?.length
    ? documento.productos.map((item: any, index: number) => [
        { text: item.id ?? index + 1, style: 'tableCell' },
        { text: item.descripcion || item.nombre || 'Artículo', style: 'tableCell' },
        { text: item.cantidad?.toString() ?? '1', style: 'tableCell', alignment: 'center' as const },
        { text: item.precio?.toFixed?.(2) ?? item.precio ?? '0.00', style: 'tableCell', alignment: 'right' as const },
        { text: item.total?.toFixed?.(2) ?? item.monto?.toFixed?.(2) ?? '0.00', style: 'tableCell', alignment: 'right' as const },
      ])
    : [
        [
          { text: 'No hay productos cargados para esta cotización.', colSpan: 5, style: 'tableCell', alignment: 'center' as const },
          {},
          {},
          {},
          {},
        ],
      ];

  return {
    pageSize: 'LETTER',
    pageMargins: [32, 36, 32, 36],
    content: [
      {
        columns: [
          {
            width: 'auto',
            stack: [
              ...(documento.logo ? [{ image: documento.logo, width: 100, margin: [0, 0, 0, 10] }] : []),
              { text: documento.empresa?.nombre || 'GOLDEN GARDEN', style: 'header' },
              { text: documento.empresa?.direccion || '4ta. Avenida y 4ta. Calle, Barrio Asunción, Tecpán Guatemala, Chimaltenango', style: 'subheader' },
              { text: `Teléfono: ${documento.empresa?.telefono || '32861562'}`, style: 'subheader' },
              { text: documento.empresa?.redes || 'Facebook: golden gardeen jardin de eventos', style: 'subheader' },
            ],
          },
          {
            width: '*',
            stack: [
              { text: 'COTIZACIÓN', style: 'titleRight' },
              { text: `Fecha: ${fecha}`, style: 'infoText' },
              { text: `Ref.: ${documento.evento?.id ?? '---'}`, style: 'infoText' },
            ],
            alignment: 'right' as const,
          },
        ],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1, lineColor: '#d0d0d0' }], margin: [0, 10, 0, 16] },
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                stack: [
                  { text: 'Cliente', style: 'sectionHeader' },
                  { text: documento.clienteNombre || documento.cliente?.nombre || 'Cliente no definido', style: 'sectionValue' },
                  { text: `DPI: ${documento.clienteDpi || documento.cliente?.dpi || 'N/A'}`, style: 'sectionValue' },
                  { text: `Teléfono: ${documento.clienteTelefono || documento.cliente?.telefono || documento.cliente?.celular || 'N/A'}`, style: 'sectionValue' },
                  { text: `Email: ${documento.clienteCorreo || documento.cliente?.email || 'N/A'}`, style: 'sectionValue' },
                ],
                border: [false, false, false, false],
              },
              {
                stack: [
                  { text: 'Evento', style: 'sectionHeader' },
                  { text: documento.evento?.titulo || documento.eventoTipo || 'Evento no definido', style: 'sectionValue' },
                  { text: `Tipo: ${documento.eventoTipo || 'N/A'}`, style: 'sectionValue' },
                  { text: `Fecha inicio: ${fechaInicio || 'N/A'}`, style: 'sectionValue' },
                  { text: `Fecha fin: ${fechaFin || 'N/A'}`, style: 'sectionValue' },
                  { text: `Horario: ${documento.eventoHorario || 'N/A'}`, style: 'sectionValue' },
                ],
                border: [false, false, false, false],
              },
            ],
          ],
        },
        layout: {
          defaultBorder: false,
          paddingLeft: () => 0,
          paddingRight: () => 0,
        },
        margin: [0, 0, 0, 8],
      },
      { text: 'Resumen de Servicios', style: 'sectionHeader', margin: [0, 14, 0, 6] },
      {
        table: {
          widths: [30, '*', 60, 90, 90],
          body: [
            [
              { text: 'ID', style: 'tableHeader' },
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Cant.', style: 'tableHeader', alignment: 'center' as const },
              { text: 'Precio', style: 'tableHeader', alignment: 'right' as const },
              { text: 'Total', style: 'tableHeader', alignment: 'right' as const },
            ],
            ...items,
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? (documento.empresa?.colorSecundario || '#2f4f4f') : rowIndex % 2 === 0 ? '#f5f5f5' : null),
          hLineColor: () => '#e4e4e4',
          vLineColor: () => '#e4e4e4',
          hLineWidth: () => 1,
          paddingLeft: () => 6,
          paddingRight: () => 6,
        },
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 200,
            table: {
              widths: ['*', 80],
              body: [
                [{ text: 'Subtotal', style: 'summaryLabel' }, { text: `Q ${documento.subtotal?.toFixed?.(2) ?? '0.00'}`, style: 'summaryValue', alignment: 'right' as const }],
                [{ text: 'Descuento', style: 'summaryLabel' }, { text: `Q ${documento.descuento?.toFixed?.(2) ?? '0.00'}`, style: 'summaryValue', alignment: 'right' as const }],
                [{ text: 'IVA', style: 'summaryLabel' }, { text: `Q ${documento.iva?.toFixed?.(2) ?? '0.00'}`, style: 'summaryValue', alignment: 'right' as const }],
                [{ text: 'Total', style: 'summaryTotal' }, { text: `Q ${documento.total?.toFixed?.(2) ?? '0.00'}`, style: 'summaryTotal', alignment: 'right' as const }],
              ],
            },
            layout: 'noBorders',
          },
        ],
        margin: [0, 12, 0, 0],
      },
      { text: 'Condiciones de pago', style: 'sectionHeader', margin: [0, 14, 0, 4] },
      { text: 'El 50% del total se abonará como anticipo para reservar la fecha. El saldo restante se liquidará el día del evento. Esta cotización es válida por 7 días.', style: 'normalText' },
      { text: `Cotización generada por ${documento.empresa?.nombre || 'Golden Garden'}.`, style: 'notaTexto', margin: [0, 8, 0, 0] },
    ],
    styles: {
      header: { fontSize: 16, bold: true, color: documento.empresa?.colorPrincipal || '#1f3a1f' },
      subheader: { fontSize: 9, color: documento.empresa?.colorTextoClaro || '#5d5d5d', margin: [0, 3, 0, 0] },
      titleRight: { fontSize: 20, bold: true, color: documento.empresa?.colorPrincipal || '#1f3a1f' },
      infoText: { fontSize: 9, color: documento.empresa?.colorTextoClaro || '#4e4e4e', margin: [0, 3, 0, 0] },
      sectionHeader: { fontSize: 10.5, bold: true, color: documento.empresa?.colorPrincipal || '#1f3a1f', margin: [0, 8, 0, 4] },
      sectionValue: { fontSize: 9, color: documento.empresa?.colorTextoOscuro || '#3e3e3e', margin: [0, 2, 0, 2] },
      tableHeader: { fontSize: 9, bold: true, color: '#ffffff', fillColor: documento.empresa?.colorPrincipal || '#1f3a1f', margin: [0, 6, 0, 6] },
      tableCell: { fontSize: 9, color: documento.empresa?.colorTextoOscuro || '#333333', margin: [0, 3, 0, 3] },
      summaryLabel: { fontSize: 9, color: documento.empresa?.colorTextoClaro || '#4f4f4f' },
      summaryValue: { fontSize: 9, bold: true, color: documento.empresa?.colorPrincipal || '#1f3a1f' },
      summaryTotal: { fontSize: 10, bold: true, color: documento.empresa?.colorPrincipal || '#1f3a1f', margin: [0, 4, 0, 4] },
      normalText: { fontSize: 9, color: documento.empresa?.colorTextoClaro || '#4e4e4e', lineHeight: 1.3 },
      notaTexto: { fontSize: 8, italics: true, color: documento.empresa?.colorTextoClaro || '#6f6f6f' },
    },
  };
}
