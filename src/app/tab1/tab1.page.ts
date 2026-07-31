import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false
})
export class Tab1Page {
  activeTab: 'login' | 'register' = 'login';

  loginEmail = '';
  loginPassword = '';

  regEmail = '';
  regPassword = '';
  regConfirm = '';

  showPassword = false;
  isLoading = false;
  loginError = '';
  registerError = '';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  setTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.loginError = '';
    this.registerError = '';
    this.showPassword = false;
  }

  async onLogin() {
    this.loginError = '';
    if (!this.loginEmail || !this.loginPassword) {
      this.loginError = 'Por favor completa todos los campos.';
      return;
    }
    this.isLoading = true;
    try {
      await this.auth.login(this.loginEmail, this.loginPassword);
      const uid = this.auth.currentUser!.uid;
      const profile = await this.profileService.loadProfile(uid);

      // ✅ AÑADIDO: manejar perfil inexistente
      if (!profile) {
        this.router.navigate(['/tab3'], { replaceUrl: true });
        return;
      }

      if (profile?.isProfileComplete) {
        this.router.navigate(['/tabs'], { replaceUrl: true });
      } else {
        this.router.navigate(['/tab3'], { replaceUrl: true });
      }
    } catch (e: any) {
      if (e.message === 'CREDENCIALES_INVALIDAS') {
        this.loginError = 'Correo o contraseña incorrectos.';
      } else {
        this.loginError = 'Ocurrió un error. Intenta de nuevo.';
      }
    } finally {
      this.isLoading = false;
    }
  }
  
  async onRegister() {
    this.registerError = '';
    if (!this.regEmail || !this.regPassword || !this.regConfirm) {
      this.registerError = 'Por favor completa todos los campos.';
      return;
    }
    if (this.regPassword.length < 6) {
      this.registerError = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.regPassword !== this.regConfirm) {
      this.registerError = 'Las contraseñas no coinciden.';
      return;
    }
    this.isLoading = true;
    try {
      await this.auth.register(this.regEmail, this.regPassword);
      await this.showToast('¡Cuenta creada! Ahora configura tu perfil 🎉');
      this.router.navigate(['/tab3'], { replaceUrl: true });
    } catch (e: any) {
      if (e.message === 'CUENTA_EXISTENTE') {
        this.registerError = '⛔ Cuenta Existente: Ya hay una cuenta con ese correo.';
      } else {
        this.registerError = 'Error al crear la cuenta. Intenta de nuevo.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'top',
      color: 'success',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}