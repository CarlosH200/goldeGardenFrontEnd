import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentLockService {

  /**
   * Guarda un BehaviorSubject por cada evento.
   *
   * La llave del Map es el idEvento.
   *
   * Ejemplo:
   *
   * Evento 10 → true
   * Evento 20 → false
   * Evento 30 → true
   */
  private locks = new Map<number, BehaviorSubject<boolean>>();

  /**
   * Obtiene el BehaviorSubject correspondiente al evento.
   *
   * Si todavía no existe, se crea.
   *
   * IMPORTANTE:
   * Se mantiene true como valor inicial para conservar
   * el comportamiento de seguridad que ya tenía tu aplicación.
   */
  private ensureSubject(id: number | string): BehaviorSubject<boolean> {
    const numId = Number(id);
    let subject = this.locks.get(numId);

    if (!subject) {
      subject = new BehaviorSubject<boolean>(false);
      this.locks.set(numId, subject);
    }

    return subject;
  }

  /**
   * Bloquea un documento.
   */
  lock(id: number | string): void {
    if (id == null) return;
    this.ensureSubject(id).next(true);
  }

  /**
   * Desbloquea un documento.
   */
  unlock(id: number | string): void {
    if (id == null) return;
    this.ensureSubject(id).next(false);
  }

  /**
   * Establece directamente el estado de bloqueo.
   */
  setLocked(id: number | string, locked: boolean): void {
    if (id == null) return;
    this.ensureSubject(id).next(locked);
  }

  /**
   * Permite que Documento, Transacción y Pago
   * escuchen el mismo estado de bloqueo.
   */
  isLocked$(id: number | string | null): Observable<boolean> {
    if (id == null || id === '') {
      return new BehaviorSubject<boolean>(false).asObservable();
    }
    return this.ensureSubject(id).asObservable();
  }
}