import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoriesService, Story } from '../../services/stories.service';
import { AuthService } from '../../services/auth.service';
import { VoiceSettingsService } from '../../services/voice-settings.service';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.page.html',
  styleUrls: ['./story-detail.page.scss'],
  standalone: false
})
export class StoryDetailPage implements OnInit, OnDestroy {
  story: Story | null = null;
  loading = true;
  isReading = false;
  speechSynthesis: SpeechSynthesis | null = null;
  isTemporary = false; // Indica si es una historia temporal (no guardada)
  imageLoading = true; // Indica si la imagen está cargando
  private storiesSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storiesService: StoriesService,
    private authService: AuthService,
    private voiceSettings: VoiceSettingsService,
    private toastCtrl: ToastController
  ) {
    // Inicializar Text-to-Speech
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  async ngOnInit() {
    const storyId = this.route.snapshot.paramMap.get('id');
    
    // Verificar si es una historia temporal (no guardada)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['tempStory']) {
      this.story = navigation.extras.state['tempStory'];
      this.isTemporary = navigation.extras.state['isTemporary'] || false;
      this.loading = false;
      return;
    }
    
    // Cargar historia guardada
    if (storyId) {
      await this.loadStory(storyId);
    }
  }

  async loadStory(storyId: string) {
    this.loading = true;
    const uid = this.authService.currentUser?.uid || '';
    
    // Cargar historias si no están cargadas
    const stories = this.storiesService.currentStories;
    if (stories.length === 0) {
      await this.storiesService.loadStories(uid);
    }

    // Buscar la historia
    this.story = this.storiesService.currentStories.find(s => s.id === storyId) || null;
    this.loading = false;

    if (!this.story) {
      this.router.navigate(['/tabs']);
      return;
    }
    
    // Suscribirse a cambios en las historias para detectar cuando se actualice la imagen
    this.storiesSubscription = this.storiesService.stories.subscribe(updatedStories => {
      const updatedStory = updatedStories.find(s => s.id === storyId);
      if (updatedStory && updatedStory.imageUrl && !this.story?.imageUrl) {
        console.log('🎨 Nueva imagen detectada!');
        this.story = updatedStory;
        this.showImageReadyToast();
      }
    });
  }

  async showImageReadyToast() {
    const toast = await this.toastCtrl.create({
      message: '🎨 ¡La imagen de tu historia está lista!',
      duration: 3000,
      position: 'top',
      color: 'success',
      buttons: [
        {
          text: 'Ver',
          handler: () => {
            // Scroll hacia la imagen
            const imageElement = document.querySelector('.story-image');
            if (imageElement) {
              imageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      ]
    });
    await toast.present();
  }

  async toggleFavorite() {
    if (this.story) {
      const uid = this.authService.currentUser?.uid || '';
      await this.storiesService.toggleFavorite(uid, this.story.id);
      this.story.isFavorite = !this.story.isFavorite;
    }
  }

  goBack() {
    // Detener lectura si está activa
    this.stopReading();
    this.router.navigate(['/tabs']);
  }

  toggleReading() {
    if (this.isReading) {
      this.stopReading();
    } else {
      this.startReading();
    }
  }

  startReading() {
    if (!this.speechSynthesis || !this.story) return;

    // Detener cualquier lectura previa
    this.speechSynthesis.cancel();

    // Crear el texto a leer (título + contenido)
    const textToRead = `${this.story.title}. ${this.story.content}`;

    // Crear la utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Obtener configuraciones guardadas
    const settings = this.voiceSettings.currentSettings;
    
    // Configurar voz
    const voices = this.speechSynthesis.getVoices();
    
    // Si hay una voz seleccionada, usarla
    if (settings.selectedVoice) {
      const selectedVoice = voices.find(v => v.voiceURI === settings.selectedVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    } else {
      // Si no, buscar una voz en español
      const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
    }
    
    // Aplicar configuraciones
    utterance.lang = 'es-ES';
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Eventos
    utterance.onstart = () => {
      this.isReading = true;
    };

    utterance.onend = () => {
      this.isReading = false;
    };

    utterance.onerror = () => {
      this.isReading = false;
    };

    // Iniciar lectura
    this.speechSynthesis.speak(utterance);
  }

  stopReading() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isReading = false;
    }
  }

  ngOnDestroy() {
    // Limpiar al salir
    this.stopReading();
    if (this.storiesSubscription) {
      this.storiesSubscription.unsubscribe();
    }
  }

  onImageLoad(event: any) {
    console.log('✅ Imagen cargada correctamente');
    console.log('📊 Dimensiones:', event.target.naturalWidth, 'x', event.target.naturalHeight);
    this.imageLoading = false;
  }

  onImageError(event: any) {
    console.error('❌ Error al cargar imagen:', event);
    console.error('🔗 URL que falló:', this.story?.imageUrl);
    this.imageLoading = false;
    
    // Mostrar un placeholder en caso de error
    if (this.story?.imageUrl) {
      console.log('🎨 Usando imagen placeholder');
      // Usar un placeholder de Picsum diferente como fallback
      const fallbackSeed = 'fallback-' + Date.now();
      this.story.imageUrl = `https://picsum.photos/seed/${fallbackSeed}/1024/1024`;
    }
  }
}
