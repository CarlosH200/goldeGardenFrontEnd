import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentLockService {
  private locks = new Map<number, BehaviorSubject<boolean>>();

  private ensureSubject(id: number): BehaviorSubject<boolean> {
    let s = this.locks.get(id);
    if (!s) {
      // Por defecto, asumir documento bloqueado hasta que el usuario lo desbloquee
      s = new BehaviorSubject<boolean>(true);
      this.locks.set(id, s);
    }
    return s;
  }

  lock(id: number): void {
    this.ensureSubject(id).next(true);
  }

  unlock(id: number): void {
    this.ensureSubject(id).next(false);
  }

  isLocked$(id: number | null): Observable<boolean> {
    if (id == null) return new BehaviorSubject<boolean>(true).asObservable();
    return this.ensureSubject(id).asObservable();
  }
}
