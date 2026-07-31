import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageGenerationService {
  
  constructor(private http: HttpClient) {}

  /**
   * Genera una imagen usando Picsum Photos (GRATIS, confiable y sin API key)
   * @param prompt Descripción de la imagen
   * @returns URL de la imagen generada
   */
  generateImage(prompt: string): Observable<string> {
    console.log('🎨 Generando imagen');
    console.log('📝 Prompt:', prompt);
    
    // Usar Picsum Photos - API confiable y gratuita
    // Genera un seed único basado en el prompt para que cada historia tenga una imagen diferente
    const seed = this.generateSeed(prompt);
    const imageUrl = `https://picsum.photos/seed/${seed}/1024/1024`;
    
    console.log('🔗 URL generada:', imageUrl);
    console.log('🌱 Seed:', seed);
    
    return of(imageUrl);
  }

  /**
   * Genera un seed único basado en el prompt para obtener imágenes consistentes
   */
  private generateSeed(prompt: string): string {
    // Crear un hash simple del prompt para generar un seed único
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Agregar timestamp para que cada historia tenga una imagen diferente
    const timestamp = Date.now();
    const seed = `story-${Math.abs(hash)}-${timestamp}`;
    
    return seed;
  }

  /**
   * Genera un prompt de imagen desde el contenido de la historia
   */
  generatePromptFromStory(
    title: string,
    content: string,
    characters: string[],
    setting: string
  ): string {
    // Para Picsum, solo necesitamos un string único que identifique la historia
    // Combinamos título, personajes y entorno para crear un identificador único
    const prompt = `${title}-${characters.join('-')}-${setting}`;
    
    console.log('📝 Prompt para imagen:', prompt);
    
    return prompt;
  }
}
