import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export interface VoiceSettings {
  selectedVoice: string; // URI de la voz seleccionada
  rate: number; // Velocidad (0.1 - 2.0)
  pitch: number; // Tono (0.0 - 2.0)
  volume: number; // Volumen (0.0 - 1.0)
}

@Injectable({
  providedIn: 'root'
})
export class VoiceSettingsService {
  private defaultSettings: VoiceSettings = {
    selectedVoice: '', // Vacío = voz por defecto del sistema
    rate: 0.9,
    pitch: 1.1,
    volume: 1.0
  };

  private settings$ = new BehaviorSubject<VoiceSettings>(this.defaultSettings);

  get voiceSettings() {
    return this.settings$.asObservable();
  }

  get currentSettings(): VoiceSettings {
    return this.settings$.value;
  }

  constructor() {
    this.loadSettings();
  }

  async loadSettings(): Promise<void> {
    const { value } = await Preferences.get({ key: 'voice_settings' });
    if (value) {
      const settings = JSON.parse(value);
      this.settings$.next(settings);
    }
  }

  async saveSettings(settings: VoiceSettings): Promise<void> {
    await Preferences.set({
      key: 'voice_settings',
      value: JSON.stringify(settings)
    });
    this.settings$.next(settings);
  }

  async updateVoice(voiceURI: string): Promise<void> {
    const settings = { ...this.settings$.value, selectedVoice: voiceURI };
    await this.saveSettings(settings);
  }

  async updateRate(rate: number): Promise<void> {
    const settings = { ...this.settings$.value, rate };
    await this.saveSettings(settings);
  }

  async updatePitch(pitch: number): Promise<void> {
    const settings = { ...this.settings$.value, pitch };
    await this.saveSettings(settings);
  }

  async updateVolume(volume: number): Promise<void> {
    const settings = { ...this.settings$.value, volume };
    await this.saveSettings(settings);
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }

  getSpanishVoices(): SpeechSynthesisVoice[] {
    return this.getAvailableVoices().filter(voice => 
      voice.lang.startsWith('es')
    );
  }
}
