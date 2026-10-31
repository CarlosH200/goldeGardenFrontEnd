import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { EventosService } from '../../services/eventosService';
import { TransaccionesService } from '../../services/transacciones.service';
import { PagosService } from '../../services/pagosService';
import { ClientesService } from '../../services/cliente.service';
import { EventosModel } from '../../models/eventosModel';
import { PagoModel } from '../../models/pagoModel';
import { ClienteModel } from '../../models/clienteModel';
import { EstadoService } from '../../services/estadoService';
import { EstadosModel } from '../../models/estadoModel';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: EventosModel[];
}

@Component({
  selector: 'app-event-calendar',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-calendar.component.html',
  styleUrl: './event-calendar.component.css'
})
export class EventCalendarComponent implements OnInit {

  // ========== TABS ==========
  activeTab: 'lista' | 'calendario' = 'calendario';

  // ========== CALENDAR STATE ==========
  calendarView: 'mes' | 'semana' | 'dia' = 'mes';
  currentDate: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekDayNames: string[] = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // ========== DATA & FILTERS ==========
  eventos: EventosModel[] = [];
  filteredEventos: EventosModel[] = [];
  searchQuery: string = '';
  selectedEstado: number | null = 4; // Por defecto 4 (Confirmados)
  estadosList: EstadosModel[] = [
    { id: 1, descripcion: 'Activo' } as any,
    { id: 2, descripcion: 'Cancelado' } as any,
    { id: 3, descripcion: 'Completado' } as any,
    { id: 4, descripcion: 'Confirmado' } as any,
  ];
  loading: boolean = false;
  loadError: string = '';

  // ========== DETAIL PANEL ==========
  selectedEvent: EventosModel | null = null;
  detailCliente: ClienteModel | null = null;
  detailClienteLoading: boolean = false;
  detailTransacciones: any[] = [];
  detailPagos: PagoModel[] = [];
  detailLoading: boolean = false;
  showDetail: boolean = false;

  // ========== WEEK VIEW ==========
  weekDays: CalendarDay[] = [];

  // ========== DAY VIEW ==========
  dayEvents: EventosModel[] = [];
  dayHours: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(
    public theme: ThemeService,
    private eventosService: EventosService,
    private transaccionesService: TransaccionesService,
    private pagosService: PagosService,
    private clientesService: ClientesService,
    private estadoService: EstadoService
  ) {}

  ngOnInit(): void {
    this.loadEstados();
    this.loadEventos();
  }

  // ========== ESTADOS LOADING ==========
  loadEstados(): void {
    this.estadoService.getEstados().subscribe({
      next: (data: any) => {
        const raw = Array.isArray(data) ? data : (data?.data || []);
        if (Array.isArray(raw) && raw.length > 0) {
          this.estadosList = raw.map((item: any) => ({
            ...item,
            id: Number(item.id ?? item.Id),
            descripcion: item.descripcion ?? item.Descripcion ?? `Estado ${item.id ?? item.Id}`
          }));

          // Garantizar que el estado 4 esté disponible
          if (!this.estadosList.some(e => e.id === 4)) {
            this.estadosList.push({ id: 4, descripcion: 'Confirmado' } as any);
          }
        }
      },
      error: (err) => {
        console.error('Error al cargar lista de estados:', err);
      }
    });
  }

  // Normalizar datos por si vienen en PascalCase o camelCase
  private normalizeEvent(e: any): EventosModel {
    return {
      id: Number(e.id ?? e.Id ?? 0),
      titulo: e.titulo ?? e.Titulo ?? 'Sin título',
      descripcion: e.descripcion ?? e.Descripcion ?? '',
      fecha_Ini: e.fecha_Ini ?? e.Fecha_Ini ?? '',
      fecha_Fin: e.fecha_Fin ?? e.Fecha_Fin ?? '',
      fecha_Entrega: e.fecha_Entrega ?? e.Fecha_Entrega ?? '',
      fecha_Recepcion: e.fecha_Recepcion ?? e.Fecha_Recepcion ?? '',
      ubicacion: Number(e.ubicacion ?? e.Ubicacion ?? 0),
      organizador: Number(e.organizador ?? e.Organizador ?? 0),
      tipo_Evento: Number(e.tipo_Evento ?? e.Tipo_Evento ?? 0),
      capacidad_Evento: Number(e.capacidad_Evento ?? e.Capacidad_Evento ?? 0),
      Observacion: e.Observacion ?? e.observacion ?? '',
      url_Evento: e.url_Evento ?? e.Url_Evento ?? '',
      estado: Number(e.estado ?? e.Estado ?? 0),
      username: e.username ?? e.Username ?? '',
      m_Username: e.m_Username ?? e.M_Username ?? '',
      fecha_Hora: e.fecha_Hora ?? e.Fecha_Hora ?? '',
      m_Fecha_Hora: e.m_Fecha_Hora ?? e.M_Fecha_Hora ?? null,
      consecutivo_Interno: Number(e.consecutivo_Interno ?? e.Consecutivo_Interno ?? 0),
      bloqueado: Boolean(e.bloqueado ?? e.BLOQUEADO ?? false),
      impreso: Boolean(e.impreso ?? e.IMPRESO ?? false),
      impresiones: Number(e.impresiones ?? e.IMPRESIONES ?? 0),
      id_cliente: Number(e.id_cliente ?? e.Id_Cliente ?? e.idCliente ?? 0),
      ubicacion_Nombre: e.ubicacion_Nombre ?? e.Ubicacion_Nombre ?? '',
      organizador_Nombre: e.organizador_Nombre ?? e.Organizador_Nombre ?? '',
      tipo_Evento_Descripcion: e.tipo_Evento_Descripcion ?? e.Tipo_Evento_Descripcion ?? '',
      estado_Descripcion: e.estado_Descripcion ?? e.Estado_Descripcion ?? ''
    };
  }

  // Parsear fechas evitando desfasajes de zona horaria
  private parseDate(dateStr: string | Date): Date | null {
    if (!dateStr) return null;
    if (dateStr instanceof Date) return dateStr;
    const str = dateStr.toString().trim();
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  }

  // ========== DATA LOADING ==========
  loadEventos(): void {
    this.loading = true;
    this.loadError = '';

    const estadoParam = (this.selectedEstado === null || this.selectedEstado === undefined || isNaN(Number(this.selectedEstado)))
      ? null
      : Number(this.selectedEstado);

    this.eventosService.obtenerEventos(estadoParam).subscribe({
      next: (res: any) => {
        const raw = Array.isArray(res) ? res : (res?.data || []);
        if (Array.isArray(raw)) {
          this.eventos = raw.map(e => this.normalizeEvent(e));
          this.onSearchChange();

          // Si el mes actual no contiene eventos pero la lista sí tiene eventos, enfocar el calendario en la fecha del evento
          if (this.eventos.length > 0) {
            const hasInCurrentMonth = this.eventos.some(e => {
              const d = this.parseDate(e.fecha_Ini);
              return d && d.getFullYear() === this.currentDate.getFullYear() && d.getMonth() === this.currentDate.getMonth();
            });
            if (!hasInCurrentMonth) {
              const firstDate = this.parseDate(this.eventos[0].fecha_Ini);
              if (firstDate) {
                this.currentDate = new Date(firstDate);
              }
            }
          }

          this.buildCalendar();
        } else {
          this.eventos = [];
          this.filteredEventos = [];
          this.loadError = 'La API no devolvió una lista de eventos válida.';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.loadError = err.status === 405
          ? 'La API de eventos no permite GET. Debe habilitarse el método de consulta en el backend.'
          : 'No fue posible cargar los eventos. Verifica que la API esté disponible.';
        this.loading = false;
      }
    });
  }

  onEstadoFilterChange(val?: any): void {
    if (val === 'null' || val === null || val === undefined || val === '') {
      this.selectedEstado = null;
    } else {
      this.selectedEstado = Number(val);
    }
    this.loadEventos();
  }

  // ========== LIST SEARCH ==========
  onSearchChange(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredEventos = [...this.eventos];
      return;
    }
    this.filteredEventos = this.eventos.filter(e =>
      (e.titulo || '').toLowerCase().includes(q) ||
      (e.descripcion || '').toLowerCase().includes(q) ||
      (e.ubicacion_Nombre || '').toLowerCase().includes(q) ||
      (e.organizador_Nombre || '').toLowerCase().includes(q) ||
      (e.tipo_Evento_Descripcion || '').toLowerCase().includes(q) ||
      (e.estado_Descripcion || '').toLowerCase().includes(q) ||
      (e.id + '').includes(q)
    );
  }

  // ========== CALENDAR GENERATION ==========
  buildCalendar(): void {
    if (this.calendarView === 'mes') {
      this.buildMonthView();
    } else if (this.calendarView === 'semana') {
      this.buildWeekView();
    } else {
      this.buildDayView();
    }
  }

  buildMonthView(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    const remaining = 6 - lastDay.getDay();
    endDate.setDate(endDate.getDate() + remaining);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.calendarDays = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayDate = new Date(current);
      const dayEvents = this.getEventsForDate(dayDate);

      this.calendarDays.push({
        date: dayDate,
        day: dayDate.getDate(),
        isCurrentMonth: dayDate.getMonth() === month,
        isToday: dayDate.getTime() === today.getTime(),
        events: dayEvents
      });

      current.setDate(current.getDate() + 1);
    }
  }

  buildWeekView(): void {
    const startOfWeek = new Date(this.currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(dayDate.getDate() + i);
      const dayEvents = this.getEventsForDate(dayDate);

      this.weekDays.push({
        date: dayDate,
        day: dayDate.getDate(),
        isCurrentMonth: dayDate.getMonth() === this.currentDate.getMonth(),
        isToday: dayDate.getTime() === today.getTime(),
        events: dayEvents
      });
    }
  }

  buildDayView(): void {
    this.dayEvents = this.getEventsForDate(this.currentDate);
  }

  getEventsForDate(date: Date): EventosModel[] {
    return this.eventos.filter(e => {
      const eventDate = this.parseDate(e.fecha_Ini);
      if (!eventDate) return false;
      return eventDate.getFullYear() === date.getFullYear() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getDate() === date.getDate();
    });
  }

  // ========== NAVIGATION ==========
  prev(): void {
    if (this.calendarView === 'mes') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    } else if (this.calendarView === 'semana') {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() - 7);
      this.currentDate = d;
    } else {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() - 1);
      this.currentDate = d;
    }
    this.buildCalendar();
  }

  next(): void {
    if (this.calendarView === 'mes') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    } else if (this.calendarView === 'semana') {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() + 7);
      this.currentDate = d;
    } else {
      const d = new Date(this.currentDate);
      d.setDate(d.getDate() + 1);
      this.currentDate = d;
    }
    this.buildCalendar();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.buildCalendar();
  }

  setCalendarView(view: 'mes' | 'semana' | 'dia'): void {
    this.calendarView = view;
    this.buildCalendar();
  }

  onDayClick(day: CalendarDay): void {
    this.currentDate = new Date(day.date);
    this.calendarView = 'dia';
    this.buildCalendar();
  }

  // ========== FORMATTING ==========
  getMonthYearLabel(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  getWeekLabel(): string {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const formatDay = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
    return `${formatDay(startOfWeek)} - ${formatDay(endOfWeek)}, ${endOfWeek.getFullYear()}`;
  }

  getDayLabel(): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const d = this.currentDate;
    return `${dias[d.getDay()]} ${d.getDate()} de ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  getCurrentLabel(): string {
    if (this.calendarView === 'mes') return this.getMonthYearLabel();
    if (this.calendarView === 'semana') return this.getWeekLabel();
    return this.getDayLabel();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const d = this.parseDate(dateStr) || new Date(dateStr);
    return d.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-GT', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });
  }

  formatCurrency(amount: number): string {
    return `Q${(amount || 0).toFixed(2)}`;
  }

  // ========== EVENT DETAIL ==========
  onEventClick(evento: EventosModel): void {
    this.selectedEvent = evento;
    this.showDetail = true;
    this.detailLoading = true;
    this.detailCliente = null;
    this.detailClienteLoading = Boolean(evento.id_cliente);
    this.detailTransacciones = [];
    this.detailPagos = [];

    if (evento.id_cliente) {
      const eventData = evento as any;
      const clienteIncluido = eventData.cliente_Nombre || eventData.Cliente_Nombre;

      if (clienteIncluido) {
        this.detailCliente = {
          id: Number(evento.id_cliente),
          nombre: clienteIncluido,
          apellido: eventData.cliente_Apellido || eventData.Cliente_Apellido || '',
          nit: eventData.cliente_NIT || eventData.Cliente_NIT || '',
          email: eventData.cliente_Email || eventData.Cliente_Email || '',
          telefono: eventData.cliente_Telefono || eventData.Cliente_Telefono || '',
          celular: '',
          dpi: eventData.cliente_DPI || eventData.Cliente_DPI || '',
          direccion: eventData.cliente_Direccion || eventData.Cliente_Direccion || ''
        } as ClienteModel;
        this.detailClienteLoading = false;
      }

      this.clientesService.buscarClientes(String(evento.id_cliente)).subscribe({
        next: (res) => {
          if (!this.detailCliente) {
            const clientes = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
            this.detailCliente = clientes.find((cliente: ClienteModel) => cliente.id === evento.id_cliente) ?? clientes[0] ?? null;
          }
          this.detailClienteLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar el cliente del evento:', err);
          this.detailClienteLoading = false;
        }
      });
    }

    // Cargar transacciones
    this.transaccionesService.buscarTransaccionesEvento(evento.id).subscribe({
      next: (res: any) => {
        if (res?.success && Array.isArray(res.data)) {
          this.detailTransacciones = res.data.filter((t: any) => t.estado === 1).map((t: any) => {
            const cantidad = Number(t.cantidad) || 1;
            const monto = Number(t.monto) || 0;
            return {
              id: t.id,
              descripcion: t.descripcion || t.observacion_01 || 'Artículo',
              cantidad,
              precio: cantidad ? monto / cantidad : monto,
              total: monto
            };
          });
        }
        this.loadPagos(evento.id);
      },
      error: () => {
        this.loadPagos(evento.id);
      }
    });
  }

  private loadPagos(idEvento: number): void {
    this.pagosService.obtenerPagos(idEvento).subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.detailPagos = res.data.filter(p => p.estado === 1);
        }
        this.detailLoading = false;
      },
      error: () => {
        this.detailLoading = false;
      }
    });
  }

  closeDetail(): void {
    this.showDetail = false;
    this.selectedEvent = null;
    this.detailCliente = null;
    this.detailClienteLoading = false;
  }

  // ========== COMPUTED VALUES ==========
  get totalTransacciones(): number {
    return this.detailTransacciones.reduce((sum: number, t: any) => sum + (Number(t.total) || 0), 0);
  }

  get totalPagado(): number {
    return this.detailPagos.reduce((sum, p) => sum + (Number(p.monto_Pagado) || 0), 0);
  }

  get saldoPendiente(): number {
    return Math.max(0, this.totalTransacciones - this.totalPagado);
  }

  getEventColor(evento: EventosModel): string {
    const colors = [
      '#065b32', '#e1b244', '#2196F3', '#9C27B0',
      '#FF5722', '#009688', '#795548', '#607D8B'
    ];
    return colors[evento.id % colors.length];
  }

  getEstadoClass(estado: number): string {
    switch (estado) {
      case 1: return 'estado-activo';
      case 2: return 'estado-cancelado';
      case 3: return 'estado-completado';
      case 4: return 'estado-confirmado';
      default: return 'estado-activo';
    }
  }
}
