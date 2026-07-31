import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { N8nService, StoryRequest } from '../../services/n8n.service';
import { StoriesService } from '../../services/stories.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { ImageGenerationService } from '../../services/image-generation.service';

interface Character {
  id: string;
  name: string;
  emoji: string;
}

interface Setting {
  id: string;
  name: string;
  emoji: string;
}

interface StoryType {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

@Component({
  selector: 'app-create-story',
  templateUrl: './create-story.page.html',
  styleUrls: ['./create-story.page.scss'],
  standalone: false
})
export class CreateStoryPage implements OnInit {
  step: 'characters' | 'setting' | 'type' | 'generating' = 'characters';
  
  selectedCharacters: string[] = [];
  selectedSetting: string = '';
  selectedType: string = '';
  
  // Control de peticiones
  isGenerating: boolean = false;
  lastRequestTime: number = 0;
  minTimeBetweenRequests: number = 3000; // 3 segundos entre peticiones

  characters: Character[] = [
    { id: 'dragon', name: 'Dragón', emoji: '🐉' },
    { id: 'unicornio', name: 'Unicornio', emoji: '🦄' },
    { id: 'dinosaurio', name: 'Dinosaurio', emoji: '🦕' },
    { id: 'astronauta', name: 'Astronauta', emoji: '👨‍🚀' },
    { id: 'pirata', name: 'Pirata', emoji: '🏴‍☠️' },
    { id: 'princesa', name: 'Princesa', emoji: '👸' },
    { id: 'principe', name: 'Príncipe', emoji: '🤴' },
    { id: 'hada', name: 'Hada', emoji: '🧚' },
    { id: 'robot', name: 'Robot', emoji: '🤖' },
    { id: 'leon', name: 'León', emoji: '🦁' },
    { id: 'elefante', name: 'Elefante', emoji: '🐘' },
    { id: 'delfin', name: 'Delfín', emoji: '🐬' },
    { id: 'mago', name: 'Mago', emoji: '🧙' },
    { id: 'superhéroe', name: 'Superhéroe', emoji: '🦸' },
    { id: 'sirena', name: 'Sirena', emoji: '🧜' },
    { id: 'ninja', name: 'Ninja', emoji: '🥷' },
  ];

  settings: Setting[] = [
    { id: 'bosque', name: 'Bosque Mágico', emoji: '🌲' },
    { id: 'espacio', name: 'Espacio Exterior', emoji: '🚀' },
    { id: 'oceano', name: 'Océano Profundo', emoji: '🌊' },
    { id: 'castillo', name: 'Castillo Encantado', emoji: '🏰' },
    { id: 'ciudad', name: 'Ciudad Futurista', emoji: '🏙️' },
    { id: 'montaña', name: 'Montaña Nevada', emoji: '🏔️' },
    { id: 'desierto', name: 'Desierto Misterioso', emoji: '🏜️' },
    { id: 'selva', name: 'Selva Tropical', emoji: '🌴' },
    { id: 'isla', name: 'Isla del Tesoro', emoji: '🏝️' },
    { id: 'nube', name: 'Reino en las Nubes', emoji: '☁️' },
    { id: 'cueva', name: 'Cueva de Cristal', emoji: '💎' },
    { id: 'granja', name: 'Granja Divertida', emoji: '🚜' },
  ];

  storyTypes: StoryType[] = [
    { id: 'aventura', name: 'Aventura', emoji: '🗺️', description: 'Una emocionante aventura llena de acción' },
    { id: 'fantasia', name: 'Fantasía', emoji: '🧚', description: 'Un mundo mágico y fantástico' },
    { id: 'misterio', name: 'Misterio', emoji: '🔍', description: 'Un enigma por resolver' },
    { id: 'humor', name: 'Humor', emoji: '😂', description: 'Una historia divertida y graciosa' },
    { id: 'amistad', name: 'Amistad', emoji: '🤝', description: 'Sobre la importancia de los amigos' },
    { id: 'valentia', name: 'Valentía', emoji: '💪', description: 'Sobre ser valiente y superar miedos' },
    { id: 'aprendizaje', name: 'Aprendizaje', emoji: '📚', description: 'Aprender algo nuevo y emocionante' },
    { id: 'naturaleza', name: 'Naturaleza', emoji: '🌿', description: 'Cuidar el planeta y los animales' },
  ];

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private n8nService: N8nService,
    private storiesService: StoriesService,
    private profileService: ProfileService,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private imageGenerationService: ImageGenerationService
  ) {}

  ngOnInit() {
    // Cargar suscripción del usuario
    const uid = this.authService.currentUser?.uid;
    if (uid) {
      this.subscriptionService.loadSubscription(uid);
    }
  }

  get availableCharacters(): Character[] {
    const maxCharacters = this.subscriptionService.getMaxCharacters();
    if (maxCharacters === 0) return this.characters; // Ilimitado
    return this.characters.slice(0, maxCharacters);
  }

  get availableSettings(): Setting[] {
    const maxSettings = this.subscriptionService.getMaxSettings();
    if (maxSettings === 0) return this.settings; // Ilimitado
    return this.settings.slice(0, maxSettings);
  }

  toggleCharacter(characterId: string) {
    const index = this.selectedCharacters.indexOf(characterId);
    if (index > -1) {
      this.selectedCharacters.splice(index, 1);
    } else {
      const maxCharacters = this.subscriptionService.getMaxCharacters();
      const limit = maxCharacters === 0 ? 3 : maxCharacters;
      
      if (this.selectedCharacters.length < limit) {
        this.selectedCharacters.push(characterId);
      } else {
        const planName = this.subscriptionService.currentPlan.name;
        this.showToast(`Máximo ${limit} personajes en el plan ${planName}. Actualiza tu plan para más opciones.`);
      }
    }
  }

  isCharacterSelected(characterId: string): boolean {
    return this.selectedCharacters.includes(characterId);
  }

  selectSetting(settingId: string) {
    this.selectedSetting = settingId;
  }

  selectType(typeId: string) {
    this.selectedType = typeId;
  }

  canContinue(): boolean {
    switch (this.step) {
      case 'characters':
        return this.selectedCharacters.length > 0;
      case 'setting':
        return this.selectedSetting !== '';
      case 'type':
        return this.selectedType !== '';
      default:
        return false;
    }
  }

  nextStep() {
    if (!this.canContinue()) return;

    // Prevenir múltiples clics
    if (this.isGenerating) {
      this.showToast('Ya estamos creando tu historia, espera un momento...');
      return;
    }

    switch (this.step) {
      case 'characters':
        this.step = 'setting';
        break;
      case 'setting':
        this.step = 'type';
        break;
      case 'type':
        this.generateStory();
        break;
    }
  }

  previousStep() {
    switch (this.step) {
      case 'setting':
        this.step = 'characters';
        break;
      case 'type':
        this.step = 'setting';
        break;
      case 'characters':
        this.router.navigate(['/tabs']);
        break;
    }
  }

  async generateStory() {
    // Prevenir múltiples peticiones simultáneas
    if (this.isGenerating) {
      console.log('⚠️ Ya hay una petición en curso, ignorando...');
      return;
    }

    // Verificar tiempo mínimo entre peticiones (rate limiting local)
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minTimeBetweenRequests && this.lastRequestTime > 0) {
      const waitTime = Math.ceil((this.minTimeBetweenRequests - timeSinceLastRequest) / 1000);
      await this.showToast(`Espera ${waitTime} segundos antes de crear otra historia`);
      return;
    }

    // Marcar como generando
    this.isGenerating = true;
    this.lastRequestTime = now;

    const loading = await this.loadingCtrl.create({
      message: 'Creando tu historia mágica... ✨',
      spinner: 'crescent',
      backdropDismiss: false
    });
    await loading.present();

    this.step = 'generating';

    try {
      const uid = this.authService.currentUser?.uid || '';
      
      // Cargar el perfil si no está cargado
      let profile = this.profileService.currentProfile;
      if (!profile && uid) {
        profile = await this.profileService.loadProfile(uid);
      }

      // Obtener el plan actual
      const currentPlan = this.subscriptionService.currentPlan;
      console.log('📋 Plan actual:', currentPlan.name, currentPlan.features);

      const request: StoryRequest = {
        characters: this.selectedCharacters,
        setting: this.selectedSetting,
        storyType: this.selectedType,
        childName: profile?.name || 'Niño',
        childAge: profile?.age || 8
      };

      console.log('📤 Enviando request a Gemini:', request);

      const response = await this.n8nService.generateStory(request).toPromise();

      console.log('📥 Respuesta de Gemini:', response);

      if (response) {
        // Ajustar longitud de la historia según el plan
        let finalContent = response.content;
        
        if (currentPlan.features.storyLength === 'short') {
          // Plan gratuito: historia breve pero completa (primeros 3-4 párrafos)
          const paragraphs = response.content.split('\n\n').filter(p => p.trim().length > 0);
          
          // Tomar los primeros 3 párrafos + agregar un final
          if (paragraphs.length > 3) {
            const shortStory = paragraphs.slice(0, 3);
            // Agregar un párrafo de cierre
            shortStory.push('\n\nY así termina esta breve aventura. ¡Actualiza tu plan para leer historias más largas y emocionantes!');
            finalContent = shortStory.join('\n\n');
          }
          
          console.log('✂️ Historia recortada para plan gratuito (breve pero completa)');
        }
        
        let imageUrl = '';
        
        // Generar imagen si tiene plan Premium
        console.log('🔍 Verificando si puede generar imagen...');
        console.log('📋 Plan:', currentPlan.name);
        console.log('🎨 hasImage:', currentPlan.features.hasImage);
        console.log('✅ canAccessFeature:', this.subscriptionService.canAccessFeature('hasImage'));
        
        if (this.subscriptionService.canAccessFeature('hasImage')) {
          console.log('✅ Plan Premium detectado - Generando imagen...');
          
          await loading.dismiss();
          
          const loadingImage = await this.loadingCtrl.create({
            message: 'Generando imagen mágica... 🎨',
            spinner: 'crescent',
            backdropDismiss: false
          });
          await loadingImage.present();

          try {
            console.log('📝 Creando prompt para imagen...');
            const prompt = this.imageGenerationService.generatePromptFromStory(
              response.title,
              finalContent,
              this.selectedCharacters,
              this.selectedSetting
            );
            
            console.log('🎨 Prompt generado:', prompt);
            console.log('🚀 Llamando a generateImage...');
            
            const generatedUrl = await this.imageGenerationService.generateImage(prompt).toPromise();
            imageUrl = generatedUrl || '';
            
            console.log('✅ Imagen generada exitosamente!');
            console.log('🔗 URL de imagen:', imageUrl);
            
            if (!imageUrl) {
              console.warn('⚠️ La URL de imagen está vacía');
            }
          } catch (error) {
            console.error('❌ Error generando imagen:', error);
            console.error('📊 Detalles del error:', JSON.stringify(error));
          }
          
          await loadingImage.dismiss();
        } else {
          console.log('❌ Plan no tiene acceso a imágenes');
          await loading.dismiss();
        }

        // Guardar solo si el plan lo permite
        if (this.subscriptionService.canAccessFeature('canSaveStories')) {
          // Guardar historia SIN imagen primero (para que el usuario pueda leerla)
          const newStory = await this.storiesService.createAIStory(
            uid,
            response.title,
            finalContent,
            this.selectedCharacters,
            this.selectedSetting,
            this.selectedType,
            '' // Sin imagen por ahora
          );

          this.isGenerating = false;
          
          // Navegar a la historia inmediatamente
          this.router.navigate(['/story-detail', newStory.id]);
          
          // Generar imagen en segundo plano si tiene plan Premium
          if (imageUrl) {
            console.log('🎨 Guardando imagen en segundo plano...');
            // Actualizar la historia con la imagen después
            setTimeout(async () => {
              await this.storiesService.updateStoryImage(uid, newStory.id, imageUrl);
              console.log('✅ Imagen guardada en la historia');
            }, 100);
          }
        } else {
          // Plan gratuito: mostrar historia sin guardar
          this.isGenerating = false;
          
          // Crear historia temporal
          const tempStory = {
            id: 'temp-' + Date.now(),
            title: response.title,
            content: finalContent,
            cover: this.getEmojiForType(this.selectedType),
            genre: this.selectedType,
            isFavorite: false,
            createdAt: Date.now(),
            imageUrl: '',
            characters: this.selectedCharacters,
            setting: this.selectedSetting,
            storyType: this.selectedType,
            isAIGenerated: true
          };
          
          // Navegar con la historia temporal (no guardada)
          this.router.navigate(['/story-detail', tempStory.id], {
            state: { tempStory, isTemporary: true }
          });
        }
      }
    } catch (error: any) {
      console.error('❌ Error al generar historia:', error);
      
      await loading.dismiss();
      
      // Determinar el tipo de error y mostrar mensaje apropiado
      let errorMessage = 'No pudimos crear la historia. ¿Intentamos de nuevo?';
      let showRetry = true;
      
      if (error.message) {
        if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
          errorMessage = 'Has hecho muchas peticiones. Espera 1 minuto e intenta de nuevo.';
          showRetry = false;
          this.lastRequestTime = Date.now();
        } else if (error.message.includes('quota') || error.message.includes('créditos')) {
          errorMessage = 'Se agotaron los créditos de la API. Contacta al administrador.';
          showRetry = false;
        } else if (error.message.includes('API key')) {
          errorMessage = 'Hay un problema con la configuración. Contacta al administrador.';
          showRetry = false;
        } else {
          errorMessage = error.message;
        }
      }
      
      await this.showErrorAlert(errorMessage, showRetry);
      
      // Volver al paso anterior
      this.step = 'type';
      this.isGenerating = false;
    }
  }

  private getEmojiForType(type: string): string {
    const emojiMap: { [key: string]: string } = {
      'aventura': '🗺️',
      'fantasia': '🧚',
      'misterio': '🔍',
      'humor': '😂',
      'amistad': '🤝',
      'valentia': '💪',
      'aprendizaje': '📚',
      'naturaleza': '🌿'
    };
    return emojiMap[type] || '📖';
  }

  async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Historia creada! 🎉',
      message: 'Tu nueva historia está lista para leer',
      buttons: ['¡Genial!']
    });
    await alert.present();
  }

  async showErrorAlert(message?: string, showRetry: boolean = true) {
    const buttons: any[] = [
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ];

    if (showRetry) {
      buttons.push({
        text: 'Reintentar',
        handler: () => {
          this.generateStory();
        }
      });
    }

    const alert = await this.alertCtrl.create({
      header: 'Oops... 😕',
      message: message || 'No pudimos crear la historia. ¿Intentamos de nuevo?',
      buttons: buttons
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  getCharacterName(id: string): string {
    return this.characters.find(c => c.id === id)?.name || id;
  }

  getSettingName(id: string): string {
    return this.settings.find(s => s.id === id)?.name || id;
  }

  getTypeName(id: string): string {
    return this.storyTypes.find(t => t.id === id)?.name || id;
  }
}
