import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LockService {
  private unlocked$ = new BehaviorSubject<boolean>(false);

  get isUnlocked$(): Observable<boolean> {
    return this.unlocked$.asObservable();
  }

  get isUnlocked(): boolean {
    return this.unlocked$.value;
  }

  unlock() { this.unlocked$.next(true); }
  lock()   { this.unlocked$.next(false); }
}