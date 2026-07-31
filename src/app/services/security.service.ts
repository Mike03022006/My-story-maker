import { Injectable } from '@angular/core';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { sha256 } from 'js-sha256';

export type SecurityMethod = 'pin' | 'pattern' | 'question';

export interface SecurityConfig {
  uid: string;
  method: SecurityMethod;
  hashedValue: string;          // PIN o patrón hasheado
  question?: string;            // Solo para método pregunta
  hashedAnswer?: string;        // Respuesta hasheada
  needsReset?: boolean;         // True si viene de reset por correo
}

@Injectable({ providedIn: 'root' })
export class SecurityService {
  private db = getFirestore();
  private auth = getAuth();

  // ── Guardar configuración de seguridad ──────────────────
  async saveSecurity(config: Omit<SecurityConfig, 'hashedValue' | 'hashedAnswer'> & {
    rawValue: string;
    rawAnswer?: string;
  }): Promise<void> {
    const hashedValue = sha256(config.rawValue.trim().toLowerCase());
    const data: SecurityConfig = {
      uid: config.uid,
      method: config.method,
      hashedValue,
      needsReset: false,
    };

    if (config.method === 'question') {
      data.question = config.question;
      data.hashedAnswer = sha256((config.rawAnswer || '').trim().toLowerCase());
    }

    await setDoc(doc(this.db, 'security', config.uid), data);
  }

  // ── Verificar intento de desbloqueo ─────────────────────
  async verify(uid: string, rawInput: string): Promise<boolean> {
    const config = await this.getConfig(uid);
    if (!config) return false;
    const hashed = sha256(rawInput.trim().toLowerCase());
    return hashed === config.hashedValue;
  }

  // ── Verificar respuesta secreta ─────────────────────────
  async verifyAnswer(uid: string, rawAnswer: string): Promise<boolean> {
    const config = await this.getConfig(uid);
    if (!config || config.method !== 'question') return false;
    const hashed = sha256(rawAnswer.trim().toLowerCase());
    return hashed === config.hashedAnswer;
  }

  // ── Obtener configuración ───────────────────────────────
  async getConfig(uid: string): Promise<SecurityConfig | null> {
    const snap = await getDoc(doc(this.db, 'security', uid));
    return snap.exists() ? (snap.data() as SecurityConfig) : null;
  }

  // ── Verificar si ya tiene seguridad configurada ─────────
  async hasSecuritySetup(uid: string): Promise<boolean> {
    const snap = await getDoc(doc(this.db, 'security', uid));
    return snap.exists();
  }

  // ── Eliminar configuración (al borrar perfil) ───────────
  async deleteSecurity(uid: string): Promise<void> {
    await deleteDoc(doc(this.db, 'security', uid));
  }

  // ── Recuperación por correo ─────────────────────────────
  async sendResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  // ── Marcar que necesita restablecer seguridad ───────────
  async markNeedsReset(uid: string): Promise<void> {
    await setDoc(
      doc(this.db, 'security', uid),
      { needsReset: true },
      { merge: true }
    );
  }

  async clearNeedsReset(uid: string): Promise<void> {
    await setDoc(
      doc(this.db, 'security', uid),
      { needsReset: false },
      { merge: true }
    );
  }

  // ── Hash de patrón: convierte array de puntos a string ──
  patternToString(points: number[]): string {
    return points.join('-');
  }
}