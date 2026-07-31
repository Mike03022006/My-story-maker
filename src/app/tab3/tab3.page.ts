import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ProfileService, UserProfile } from '../services/profile.service';
import { SecurityService } from '../services/security.service';
import { SecurityData } from '../components/step-security/step-security.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  currentStep = 1;
  isSaving = false;
  isEditMode = false;

  selectedAvatar = '';
  profileName = '';
  profileAge = 7;
  selectedInterests: string[] = [];

  step1Error = '';
  step2Error = '';

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private securityService: SecurityService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      const existing = await this.profileService.loadProfile(uid);
      
      // Load existing profile parameters
      if (existing) {
        this.selectedAvatar = existing.avatar;
        this.profileName = existing.name;
        this.profileAge = existing.age;
        this.selectedInterests = [...existing.interests];
      }

      // Intercept password reset loop
      const config = await this.securityService.getConfig(uid);
      if (config?.needsReset) {
        this.isEditMode = false;
        this.currentStep = 4;
        return;
      }

      // Regular edit mode logic
      if (existing?.isProfileComplete) {
        this.isEditMode = true;
      }
    }
  }

  nextStep() {
    if (this.currentStep === 1) {
      this.step1Error = '';
      if (!this.profileName.trim()) { this.step1Error = 'Por favor ingresa tu nombre.'; return; }
      if (this.isEditMode) { this.saveEditedProfile(); return; }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      this.step2Error = '';
      if (this.selectedInterests.length < 3) { this.step2Error = 'Selecciona al menos 3 gustos.'; return; }
      this.currentStep = 3;
    } else if (this.currentStep === 3) {
      this.currentStep = 4;
    }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  cancelEdit() {
    this.router.navigate(['/tabs'], { replaceUrl: true });
  }

  async saveEditedProfile() {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    this.isSaving = true;
    try {
      await this.profileService.updateProfile(uid, {
        name: this.profileName.trim(),
        avatar: this.selectedAvatar || '🦁',
      });
      await this.showToast('✅ Perfil actualizado');
      this.router.navigate(['/tabs'], { replaceUrl: true });
    } catch { await this.showToast('Error al guardar.'); }
    finally { this.isSaving = false; }
  }

  async saveProfile(securityData: SecurityData) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    this.isSaving = true;
    try {
      const profile: UserProfile = {
        uid,
        name: this.profileName.trim(),
        age: this.profileAge,
        avatar: this.selectedAvatar || '🦁',
        interests: this.selectedInterests,
        isProfileComplete: true,
      };
      await this.profileService.saveProfile(profile);

      let rawValue = '';
      if (securityData.method === 'pin') rawValue = securityData.pinValue || '';
      if (securityData.method === 'pattern') rawValue = (securityData.patternPoints || []).join('-');
      if (securityData.method === 'question') rawValue = securityData.securityAnswer || '';

      await this.securityService.saveSecurity({
        uid,
        method: securityData.method,
        rawValue,
        question: securityData.method === 'question' ? securityData.securityQuestion : undefined,
        rawAnswer: securityData.method === 'question' ? securityData.securityAnswer : undefined,
      });

      await this.showToast('🎉 ¡Perfil creado!');
      this.router.navigate(['/tabs'], { replaceUrl: true });
    } catch { await this.showToast('Error al guardar. Intenta de nuevo.'); }
    finally { this.isSaving = false; }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, position: 'top', color: 'success' });
    await toast.present();
  }
}