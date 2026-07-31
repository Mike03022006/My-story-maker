import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceSettingsService, VoiceSettings } from '../../services/voice-settings.service';

@Component({
  selector: 'app-voice-settings',
  templateUrl: './voice-settings.page.html',
  styleUrls: ['./voice-settings.page.scss'],
  standalone: false
})
export class VoiceSettingsPage implements OnInit {
  settings: VoiceSettings | null = null;
  availableVoices: SpeechSynthesisVoice[] = [];
  spanishVoices: SpeechSynthesisVoice[] = [];
  selectedVoice: string = '';

  constructor(
    private router: Router,
    private voiceSettingsService: VoiceSettingsService
  ) { }

  ngOnInit() {
    // Cargar configuraciones
    this.settings = this.voiceSettingsService.currentSettings;
    this.selectedVoice = this.settings.selectedVoice;

    // Cargar voces disponibles
    this.loadVoices();

    // Las voces pueden tardar en cargar, así que escuchamos el evento
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  loadVoices() {
    this.availableVoices = this.voiceSettingsService.getAvailableVoices();
    this.spanishVoices = this.voiceSettingsService.getSpanishVoices();
  }

  async onVoiceChange(event: any) {
    const voiceURI = event.detail.value;
    await this.voiceSettingsService.updateVoice(voiceURI);
    this.testVoice();
  }

  async onRateChange(event: any) {
    const rate = event.detail.value;
    await this.voiceSettingsService.updateRate(rate);
  }

  async onPitchChange(event: any) {
    const pitch = event.detail.value;
    await this.voiceSettingsService.updatePitch(pitch);
  }

  async onVolumeChange(event: any) {
    const volume = event.detail.value;
    await this.voiceSettingsService.updateVolume(volume);
  }

  testVoice() {
    if ('speechSynthesis' in window && this.settings) {
      const utterance = new SpeechSynthesisUtterance('Hola, soy la voz que leerá tus historias.');
      
      // Aplicar configuraciones
      if (this.selectedVoice) {
        const voice = this.availableVoices.find(v => v.voiceURI === this.selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      utterance.rate = this.settings.rate;
      utterance.pitch = this.settings.pitch;
      utterance.volume = this.settings.volume;
      utterance.lang = 'es-ES';

      window.speechSynthesis.speak(utterance);
    }
  }

  goBack() {
    this.router.navigate(['/tabs']);
  }
}
