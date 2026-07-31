import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface StoryRequest {
  characters: string[];
  setting: string;
  storyType: string;
  childName?: string;
  childAge?: number;
}

export interface StoryResponse {
  title: string;
  content: string;
  imagePrompt: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class N8nService {
  // API Key de Google Gemini (GRATIS)
  private geminiApiKey = 'AIzaSyDKa72qzcB8rP_xGjiUYxcqYVZtJQZFvW0';
  private geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiApiKey}`;

  constructor(private http: HttpClient) {}

  /**
   * Genera una historia usando Google Gemini directamente (SIN n8n)
   */
  generateStory(request: StoryRequest): Observable<StoryResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Crear el prompt para Gemini
    const prompt = `Eres un escritor experto en cuentos infantiles. Creas historias mágicas, educativas y apropiadas para niños.

Crea una historia infantil COMPLETA con estos detalles:

Personajes: ${request.characters.join(', ')}
Lugar: ${request.setting}
Tipo: ${request.storyType}
Nombre del niño: ${request.childName || 'el niño'}
Edad: ${request.childAge || 8} años

REQUISITOS IMPORTANTES:
1. Historia apropiada para niños de ${request.childAge || 8} años
2. Longitud: MÍNIMO 600 palabras, MÁXIMO 1000 palabras (historia COMPLETA con inicio, desarrollo y final)
3. Mensaje positivo y educativo
4. Incluye diálogos entre personajes
5. Final feliz y satisfactorio
6. Título ÚNICO, CREATIVO y LLAMATIVO (NO uses "Historia Mágica" ni "Aventura Mágica", cada título debe ser diferente y específico)
7. Divide la historia en 5-8 párrafos bien desarrollados
8. La historia debe estar COMPLETA, no cortada
9. Cada párrafo debe tener al menos 3-4 oraciones

Responde ÚNICAMENTE con el título en la primera línea, seguido de dos saltos de línea, y luego la historia completa.

NO uses formato JSON.
NO uses comillas.
NO uses las palabras "title" o "story".

Ejemplo de formato:
El Dragón y la Princesa Valiente

Había una vez en un reino lejano, una princesa llamada...

Párrafo 2 de la historia...

Párrafo 3 continuando...

Y así termina la historia con un final feliz.`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096, // Aumentado de 2048 a 4096 para historias completas
        topP: 0.95,
        topK: 40
      }
    };

    console.log('📤 Enviando request a Gemini:', request);

    return this.http.post<any>(this.geminiUrl, payload, { headers }).pipe(
      map(response => {
        console.log('📥 Respuesta cruda de Gemini:', response);
        
        // Extraer el contenido de la respuesta de Gemini
        let content = '';
        if (response.candidates && response.candidates[0] && 
            response.candidates[0].content && response.candidates[0].content.parts) {
          content = response.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Respuesta de Gemini inválida');
        }

        console.log('📄 Contenido extraído:', content);

        // Parsear el contenido (ahora es texto plano, no JSON)
        const lines = content.trim().split('\n');
        const title = lines[0].trim();
        const story = lines.slice(2).join('\n').trim(); // Saltar línea vacía después del título

        const storyResponse: StoryResponse = {
          title: title || 'Aventura Mágica',
          content: story,
          imagePrompt: `Una escena mágica de: ${title}`,
          imageUrl: ''
        };

        console.log('✅ Historia generada:', storyResponse.title);
        console.log('📝 Longitud:', storyResponse.content.length, 'caracteres');

        return storyResponse;
      }),
      catchError(error => {
        console.error('❌ Error en Gemini:', error);
        console.error('📊 Status:', error.status);
        console.error('💬 Message:', error.message);
        console.error('📦 Error body:', error.error);
        
        let errorMessage = 'No se pudo generar la historia. Intenta de nuevo.';
        
        if (error.status === 0) {
          errorMessage = 'No se pudo conectar con Gemini. Verifica tu conexión a internet.';
        } else if (error.status === 400) {
          errorMessage = 'Error en la petición. Por favor intenta de nuevo.';
        } else if (error.status === 429) {
          errorMessage = 'Has alcanzado el límite de peticiones. Espera 1 minuto.';
        } else if (error.status === 403) {
          errorMessage = 'API Key inválida. Contacta al administrador.';
        }
        
        console.error('🚨 Error procesado:', errorMessage);
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Actualiza la API Key de Gemini
   */
  setApiKey(apiKey: string): void {
    this.geminiApiKey = apiKey;
    this.geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.geminiApiKey}`;
  }

  /**
   * Obtiene la API Key actual
   */
  getApiKey(): string {
    return this.geminiApiKey;
  }
}
