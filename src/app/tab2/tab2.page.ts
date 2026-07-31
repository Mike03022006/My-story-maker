import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService, UserProfile, ALL_INTERESTS } from '../services/profile.service';
import { StoriesService, Story } from '../services/stories.service';
import { SecurityService } from '../services/security.service';
import { LockService } from '../services/lock.service';
import { SubscriptionService } from '../services/subscription.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit, OnDestroy {
  profile: UserProfile | null = null;
  allStories: Story[] = [];
  selectedStory: Story | null = null;
  readingStory: Story | null = null;
  viewingImage: Story | null = null;
  showSafeModeWarning = false;
  pendingStory: Story | null = null;

  securityMethod: 'pin' | 'pattern' | 'question' = 'pin';
  securityQuestion = '';

  // Usa LockService en lugar de Input
  get isUnlocked(): boolean {
    return this.lockService.isUnlocked;
  }

  private subs: Subscription[] = [];
  private allInterests = ALL_INTERESTS;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private storiesService: StoriesService,
    private securityService: SecurityService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private lockService: LockService,
    private subscriptionService: SubscriptionService
  ) {}

  async ngOnInit() {
    const uid = this.auth.currentUser?.uid;
    if (uid) {
      await this.storiesService.loadStories(uid);
      await this.subscriptionService.loadSubscription(uid);
      const config = await this.securityService.getConfig(uid);
      if (config) {
        this.securityMethod = config.method;
        this.securityQuestion = config.question || '';
        if (config.needsReset) {
          this.router.navigate(['/tab3'], { replaceUrl: true });
          return;
        }
      }
    }
    this.subs.push(
      this.profileService.userProfile$.subscribe(p => { this.profile = p; }),
      this.storiesService.stories.subscribe(s => { this.allStories = s; })
    );
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  get favorites(): Story[] { return this.allStories.filter(s => s.isFavorite); }
  get recommended(): Story[] {
    const interests = this.profile?.interests || [];
    return this.allStories.filter(s => interests.includes(s.genre));
  }

  getGenreLabel(genre: string): string {
    return this.allInterests.find(i => i.id === genre)?.label || genre;
  }

  selectStory(story: Story) {
    this.selectedStory = this.selectedStory?.id === story.id ? null : story;
  }

  readStory(story: Story) {
    // Navegar a la página de detalle de la historia
    this.router.navigate(['/story-detail', story.id]);
    
    // Si está desbloqueado, cerrar el candado (modo seguro)
    if (this.isUnlocked) {
      this.lockService.lock();
    }
    
    this.selectedStory = null;
  }

  viewImage(story: Story) {
    if (story.imageUrl) {
      // Abrir modal con la imagen
      this.viewingImage = story;
    }
  }

  closeImageModal() {
    this.viewingImage = null;
  }

  confirmSafeModeAndRead() {
    this.showSafeModeWarning = false;
    this.lockService.lock(); // Cierra el candado al empezar a leer
    if (this.pendingStory) {
      this.readingStory = this.pendingStory;
      this.pendingStory = null;
    }
    this.selectedStory = null;
  }

  cancelSafeMode() {
    this.showSafeModeWarning = false;
    this.pendingStory = null;
  }

  closeReading() { this.readingStory = null; }

  async toggleFavorite(story: Story) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return;
    await this.storiesService.toggleFavorite(uid, story.id);
    if (this.readingStory?.id === story.id) {
      this.readingStory = { ...this.readingStory, isFavorite: !this.readingStory.isFavorite };
    }
    this.showToast(story.isFavorite ? '☆ Quitado de favoritos' : '⭐ Agregado a favoritos');
  }

  async confirmDelete(story: Story) {
    const alert = await this.alertCtrl.create({
      header: '🗑️ Eliminar Historia',
      message: `¿Quieres eliminar "${story.title}"?`,
      cssClass: 'custom-alert',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', cssClass: 'alert-danger',
          handler: async () => {
            const uid = this.auth.currentUser?.uid;
            if (!uid) return;
            await this.storiesService.deleteStory(uid, story.id);
            this.selectedStory = null;
            this.showToast('Historia eliminada 🗑️');
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

  createNewStory() {
    this.router.navigate(['/create-story']);
  }

  getPlanName(): string {
    return this.subscriptionService.currentPlan.name;
  }

  getPlanIcon(): string {
    const tier = this.subscriptionService.currentSubscriptionValue.tier;
    const icons = {
      'free': 'book-outline',
      'basic': 'headset-outline',
      'premium': 'sparkles'
    };
    return icons[tier] || 'book-outline';
  }

  getPlanColor(): string {
    const tier = this.subscriptionService.currentSubscriptionValue.tier;
    const colors = {
      'free': 'medium',
      'basic': 'primary',
      'premium': 'warning'
    };
    return colors[tier] || 'medium';
  }

  goToSubscription() {
    this.router.navigate(['/subscription']);
  }
}