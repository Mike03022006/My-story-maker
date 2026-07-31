import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SecurityService } from '../../services/security.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lock-modal',
  templateUrl: './lock-modal.component.html',
  styleUrls: ['./lock-modal.component.scss'],
  standalone: false
})
export class LockModalComponent implements OnInit {

  @Input() securityMethod: 'pin' | 'pattern' | 'question' = 'pin';
  @Input() securityQuestion: string = '';

  @Output() unlocked = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  lockInput = '';
  patternPoints: number[] = [];
  lockError = '';
  isVerifying = false;

  attempts = 0;
  lockedUntil: number | null = null;

  constructor(
    private securityService: SecurityService,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.reset();
  }

  // ── Estados ──
  get isBlocked(): boolean {
    return this.lockedUntil !== null && Date.now() < this.lockedUntil;
  }

  get remainingTime(): number {
    if (!this.lockedUntil) return 0;
    return Math.ceil((this.lockedUntil - Date.now()) / 1000);
  }

  reset() {
    this.lockInput = '';
    this.patternPoints = [];
    this.lockError = '';
  }

  // ── Patrón ──
  selectPatternPoint(point: number) {
    if (!this.patternPoints.includes(point)) {
      this.patternPoints.push(point);
    }
  }

  isPatternPointActive(point: number): boolean {
    return this.patternPoints.includes(point);
  }

  getPatternOrder(point: number): number {
    return this.patternPoints.indexOf(point) + 1;
  }

  resetPattern() {
    this.patternPoints = [];
  }

  // ── Verificar ──
  async verifyAndUnlock() {
    if (this.isBlocked) return;

    const uid = this.auth.currentUser?.uid;
    if (!uid) return;

    this.isVerifying = true;
    this.lockError = '';

    try {
      const rawInput =
        this.securityMethod === 'pattern'
          ? this.securityService.patternToString(this.patternPoints)
          : this.lockInput;

      const ok = await this.securityService.verify(uid, rawInput);

      if (ok) {
        this.reset();
        this.attempts = 0;
        this.lockedUntil = null;
        this.unlocked.emit();
        return;
      }

      // ❌ intento fallido
      this.attempts++;
      this.lockError = `Clave incorrecta (${this.attempts}/3)`;
      this.reset();

      if (this.attempts >= 3) {
        this.lockedUntil = Date.now() + 60000; // 1 min
        this.lockError = '🚫 Demasiados intentos. Intenta en 1 minuto.';
      }

    } catch {
      this.lockError = 'Error al verificar.';
    } finally {
      this.isVerifying = false;
    }
  }

  // ── Cerrar ──
  closeModal() {
    this.reset();
    this.close.emit();
  }

  // ── Recuperar ──
  async forgotSecurity() {
    const email = this.auth.currentUser?.email;
    if (!email) return;

    try {
      await this.securityService.sendResetEmail(email);
      const uid = this.auth.currentUser?.uid;
      if (uid) await this.securityService.markNeedsReset(uid);

      this.close.emit();

      const alert = await this.alertCtrl.create({
        header: '📧 Correo enviado',
        message: `Revisa ${email}. Deberás crear una nueva clave.`,
        buttons: ['OK'],
      });

      await alert.present();

    } catch {
      this.lockError = 'No se pudo enviar el correo.';
    }
  }
}