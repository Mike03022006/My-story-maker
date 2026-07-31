import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isReading = false;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  /**
   * Lee un texto en voz alta
   */
  speak(text: string, lang: string = 'es-ES'): void {
    if (this.isReading) {
      this.stop();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = 0.9; // Velocidad de lectura (0.1 a 10)
    this.utterance.pitch = 1.1; // Tono de voz (0 a 2)
    this.utterance.volume = 1; // Volumen (0 a 1)

    // Buscar una voz en español si está disponible
    const voices = this.synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
    if (spanishVoice) {
      this.utterance.voice = spanishVoice;
    }

    this.utterance.onstart = () => {
      this.isReading = true;
    };

    this.utterance.onend = () => {
      this.isReading = false;
    };

    this.utterance.onerror = (event) => {
      console.error('Error en TTS:', event);
      this.isReading = false;
    };

    this.synth.speak(this.utterance);
  }

  /**
   * Pausa la lectura
   */
  pause(): void {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  /**
   * Reanuda la lectura
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  /**
   * Detiene la lectura
   */
  stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isReading = false;
    }
  }

  /**
   * Verifica si está leyendo actualmente
   */
  isSpeaking(): boolean {
    return this.isReading && this.synth.speaking;
  }

  /**
   * Verifica si está en pausa
   */
  isPaused(): boolean {
    return this.synth.paused;
  }

  /**
   * Obtiene las voces disponibles
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }

  /**
   * Obtiene las voces en español disponibles
   */
  getSpanishVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices().filter(voice => voice.lang.startsWith('es'));
  }
}
