import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProfileService } from './profile.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = getAuth();
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private profileService: ProfileService) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser$.next(user);
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUser$.value;
  }

  async register(email: string, password: string): Promise<void> {
  try {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    this.currentUser$.next(cred.user);

    // ✅ AÑADIDO: crear perfil automáticamente
    await this.profileService.saveProfile({
      uid: cred.user.uid,
      name: '',
      age: 0,
      avatar: '',
      interests: [],
      isProfileComplete: false
    });

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('CUENTA_EXISTENTE');
      }
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser$.next(cred.user);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('CREDENCIALES_INVALIDAS');
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.currentUser$.next(null);
    this.profileService.clearProfile();
  }

  isAuthenticated(): boolean {
    return !!this.currentUser$.value;
  }
}