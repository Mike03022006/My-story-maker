import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  avatar: string; // base64 or generic key
  interests: string[];
  isProfileComplete: boolean;
}

export const GENERIC_AVATARS = [
  'assets/avatars/avatar1.svg',
  'assets/avatars/avatar2.svg',
  'assets/avatars/avatar3.svg',
  'assets/avatars/avatar4.svg',
  'assets/avatars/avatar5.svg',
  'assets/avatars/avatar6.svg',
];

export const ALL_INTERESTS = [
  { id: 'aventura', label: 'Aventura', icon: '🗺️' },
  { id: 'animales', label: 'Animales', icon: '🦁' },
  { id: 'fantasia', label: 'Fantasía', icon: '🧚' },
  { id: 'ciencia', label: 'Ciencia', icon: '🔬' },
  { id: 'humor', label: 'Humor', icon: '😂' },
  { id: 'misterio', label: 'Misterio', icon: '🔍' },
  { id: 'naturaleza', label: 'Naturaleza', icon: '🌿' },
  { id: 'dinosaurios', label: 'Dinosaurios', icon: '🦕' },
  { id: 'espacio', label: 'Espacio', icon: '🚀' },
  { id: 'magia', label: 'Magia', icon: '✨' },
  { id: 'piratas', label: 'Piratas', icon: '🏴‍☠️' },
  { id: 'deportes', label: 'Deportes', icon: '⚽' },
  { id: 'musica', label: 'Música', icon: '🎵' },
  { id: 'arte', label: 'Arte', icon: '🎨' },
  { id: 'cocina', label: 'Cocina', icon: '🍰' },
];

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private profile$ = new BehaviorSubject<UserProfile | null>(null);

  get userProfile$(): Observable<UserProfile | null> {
    return this.profile$.asObservable();
  }

  get currentProfile(): UserProfile | null {
    return this.profile$.value;
  }

  async loadProfile(uid: string): Promise<UserProfile | null> {
    const { value } = await Preferences.get({ key: `profile_${uid}` });
    if (value) {
      const profile = JSON.parse(value);
      this.profile$.next(profile);
      return profile;
    }
    return null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await Preferences.set({
      key: `profile_${profile.uid}`,
      value: JSON.stringify(profile)
    });
    this.profile$.next(profile);
  }

  async updateProfile(uid: string, partial: Partial<UserProfile>): Promise<void> {
    const current = this.profile$.value;
    if (!current) return;
    const updated = { ...current, ...partial };
    await this.saveProfile(updated);
  }

  async addInterest(uid: string, interest: string): Promise<void> {
    const current = this.profile$.value;
    if (!current) return;
    if (!current.interests.includes(interest)) {
      await this.updateProfile(uid, { interests: [...current.interests, interest] });
    }
  }

  async removeInterest(uid: string, interest: string): Promise<void> {
    const current = this.profile$.value;
    if (!current) return;
    await this.updateProfile(uid, {
      interests: current.interests.filter(i => i !== interest)
    });
  }

  async deleteProfile(uid: string): Promise<void> {
    await Preferences.remove({ key: `profile_${uid}` });
    this.profile$.next(null);
  }

  clearProfile(): void {
    this.profile$.next(null);
  }

  isProfileComplete(uid: string): boolean {
    const profile = this.profile$.value;
    return !!(profile && profile.uid === uid && profile.isProfileComplete);
  }
}