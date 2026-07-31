import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ProfileService, UserProfile, ALL_INTERESTS } from '../services/profile.service';
import { StoriesService } from '../services/stories.service';
import { SecurityService } from '../services/security.service';
import { LockService } from '../services/lock.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false
})
export class TabsPage implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  showProfilePanel = false;
  showInterests = false;
  showAddInterests = false;
  selectedInterestToDelete: string | null = null;
  isTab2Active = false;
  isDarkMode = false;

  get isUnlocked(): boolean { return this.lockService.isUnlocked; }
  showLockModal = false;
  securityMethod: 'pin' | 'pattern' | 'question' = 'pin';
  securityQuestion = '';

  allInterests = ALL_INTERESTS;
  private subs: Subscription[] = [];

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private storiesService: StoriesService,
    private securityService: SecurityService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private lockService: LockService
  ) {}

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      await this.profileService.loadProfile(uid);
      await this.storiesService.loadStories(uid);
      const config = await this.securityService.getConfig(uid);
      if (config) {
        this.securityMethod = config.method;
        this.securityQuestion = config.question || '';
      }
    }

    // Recover dark mode state from body
    this.isDarkMode = document.documentElement.classList.contains('ion-palette-dark');

    this.subs.push(
      this.profileService.userProfile$.subscribe(p => { this.profile = p; }),
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
        this.isTab2Active = e.url.includes('tab2');
        if (!this.isTab2Active) this.lockService.lock();
      })
    );

    this.isTab2Active = this.router.url.includes('tab2');
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  // ── Candado ──
  toggleLock() {
    if (this.isUnlocked) {
      this.lockService.lock();
      this.showToast('🔒 Modo seguro activado');
    } else {
      this.showLockModal = true;
    }
  }

  onUnlocked() {
    this.lockService.unlock();
    this.showLockModal = false;
    this.showToast('🔓 Acceso parental desbloqueado');
  }

  // ── Avatar ──
  isEmojiAvatar(avatar?: string): boolean {
    if (!avatar) return false;
    return !avatar.startsWith('data:') && !avatar.startsWith('assets/') && !avatar.startsWith('http');
  }

  // ── Panel ──
  toggleProfilePanel() {
    this.showProfilePanel = !this.showProfilePanel;
    if (!this.showProfilePanel) {
      this.showInterests = false;
      this.showAddInterests = false;
      this.selectedInterestToDelete = null;
    }
  }

  closeProfilePanel() {
    this.showProfilePanel = false;
    this.showInterests = false;
    this.showAddInterests = false;
    this.selectedInterestToDelete = null;
  }

  toggleInterests() {
    if (!this.isUnlocked) {
      this.toggleLock();
      return;
    }
    this.showInterests = !this.showInterests;
    if (!this.showInterests) {
      this.showAddInterests = false;
      this.selectedInterestToDelete = null;
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
  }

  selectInterestForDelete(id: string) {
    this.selectedInterestToDelete = this.selectedInterestToDelete === id ? null : id;
  }

  async confirmDeleteInterest(id: string, event: Event) {
    event.stopPropagation();
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await this.profileService.removeInterest(uid, id);
    this.selectedInterestToDelete = null;
    this.showToast('Gusto eliminado 🗑️');
  }

  get availableToAdd() {
    const current = this.profile?.interests || [];
    return this.allInterests.filter(i => !current.includes(i.id));
  }

  async addInterest(id: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await this.profileService.addInterest(uid, id);
    this.showToast('¡Gusto agregado! ✨');
  }

  getInterestIcon(id: string): string {
    return this.allInterests.find(i => i.id === id)?.icon || '🎯';
  }

  getInterestLabel(id: string): string {
    return this.allInterests.find(i => i.id === id)?.label || id;
  }

  goToEditProfile() {
    if (!this.isUnlocked) {
      this.toggleLock();
      return;
    }
    this.closeProfilePanel();
    this.router.navigate(['/tab3']);
  }

  goToVoiceSettings() {
    this.closeProfilePanel();
    this.router.navigate(['/voice-settings']);
  }

  goToSubscription() {
    this.closeProfilePanel();
    this.router.navigate(['/subscription']);
  }

  async onLogout() {
    if (!this.isUnlocked) {
      this.toggleLock();
      return;
    }
    const alert = await this.alertCtrl.create({
      header: '¿Cerrar sesión?',
      message: 'Se cerrará tu sesión actual.',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', cssClass: 'alert-danger',
          handler: async () => {
            await this.auth.logout();
            this.router.navigate(['/tab1'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDeleteProfile() {
    if (!this.isUnlocked) {
      this.toggleLock();
      return;
    }
    const alert = await this.alertCtrl.create({
      header: '⚠️ Eliminar Perfil',
      message: '¿Estás seguro? Esta acción eliminará tu perfil e historias guardadas.',
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', cssClass: 'alert-danger',
          handler: async () => {
            const uid = this.auth.currentUser?.uid;
            if (!uid) return;
            await this.profileService.deleteProfile(uid);
            await this.auth.logout();
            this.router.navigate(['/tab1'], { replaceUrl: true });
          }
        }
      ]
    });
    await alert.present();
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 1800, position: 'top', color: 'success',
    });
    await toast.present();
  }
}