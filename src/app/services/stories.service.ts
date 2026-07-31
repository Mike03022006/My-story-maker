import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export interface Story {
  id: string;
  title: string;
  cover: string;
  content: string;
  genre: string;
  isFavorite: boolean;
  createdAt: number;
  imageUrl?: string; // URL de la imagen generada
  characters?: string[]; // Personajes de la historia
  setting?: string; // Ambiente/lugar
  storyType?: string; // Tipo de historia
  isAIGenerated?: boolean; // Si fue generada por IA
}

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private stories$ = new BehaviorSubject<Story[]>([]);

  get stories() {
    return this.stories$.asObservable();
  }

  get currentStories(): Story[] {
    return this.stories$.value;
  }

  async loadStories(uid: string): Promise<void> {
    const { value } = await Preferences.get({ key: `stories_${uid}` });
    if (value) {
      let stories = JSON.parse(value);
      
      // Filtrar historias vacías, inválidas o con título genérico
      stories = stories.filter((s: Story) => {
        const hasValidContent = s.title && s.content && s.content.length > 50;
        const hasGenericTitle = s.title === 'Historia Mágica' || s.title === 'Aventura Mágica';
        
        // Solo mantener historias con contenido válido Y título no genérico
        return hasValidContent && !hasGenericTitle;
      });
      
      this.stories$.next(stories);
      
      // Guardar las historias limpias
      await this.saveStories(uid, stories);
    } else {
      // Demo stories
      const demo: Story[] = [
        {
          id: '1',
          title: 'El Dragón Amigable',
          cover: '🐉',
          content: 'Había una vez un dragón llamado Fuego...',
          genre: 'fantasia',
          isFavorite: false,
          createdAt: Date.now() - 86400000
        },
        {
          id: '2',
          title: 'Viaje al Espacio',
          cover: '🚀',
          content: 'La astronauta Luna subió a su cohete...',
          genre: 'espacio',
          isFavorite: true,
          createdAt: Date.now() - 172800000
        },
        {
          id: '3',
          title: 'El Bosque Misterioso',
          cover: '🌲',
          content: 'En un bosque muy lejano vivía una niña...',
          genre: 'misterio',
          isFavorite: false,
          createdAt: Date.now() - 259200000
        },
      ];
      this.stories$.next(demo);
      await this.saveStories(uid, demo);
    }
  }

  private async saveStories(uid: string, stories: Story[]): Promise<void> {
    await Preferences.set({
      key: `stories_${uid}`,
      value: JSON.stringify(stories)
    });
    this.stories$.next(stories);
  }

  async toggleFavorite(uid: string, storyId: string): Promise<void> {
    const stories = this.stories$.value.map(s =>
      s.id === storyId ? { ...s, isFavorite: !s.isFavorite } : s
    );
    await this.saveStories(uid, stories);
  }

  async deleteStory(uid: string, storyId: string): Promise<void> {
    const stories = this.stories$.value.filter(s => s.id !== storyId);
    await this.saveStories(uid, stories);
  }

  getRecommended(interests: string[]): Story[] {
    return this.stories$.value.filter(s => interests.includes(s.genre));
  }

  getFavorites(): Story[] {
    return this.stories$.value.filter(s => s.isFavorite);
  }

  async addStory(uid: string, story: Story): Promise<void> {
    const stories = [...this.stories$.value, story];
    await this.saveStories(uid, stories);
  }

  async createAIStory(
    uid: string,
    title: string,
    content: string,
    characters: string[],
    setting: string,
    storyType: string,
    imageUrl?: string
  ): Promise<Story> {
    const newStory: Story = {
      id: Date.now().toString(),
      title,
      content,
      cover: this.getEmojiForType(storyType),
      genre: storyType,
      isFavorite: false,
      createdAt: Date.now(),
      imageUrl,
      characters,
      setting,
      storyType,
      isAIGenerated: true
    };

    await this.addStory(uid, newStory);
    return newStory;
  }

  async updateStoryImage(uid: string, storyId: string, imageUrl: string): Promise<void> {
    const key = uid ? `stories_${uid}` : 'stories';
    const { value } = await Preferences.get({ key });
    
    if (value) {
      const stories: Story[] = JSON.parse(value);
      const storyIndex = stories.findIndex(s => s.id === storyId);
      
      if (storyIndex !== -1) {
        stories[storyIndex].imageUrl = imageUrl;
        await Preferences.set({ key, value: JSON.stringify(stories) });
        this.stories$.next(stories);
        console.log('✅ Imagen actualizada en la historia:', storyId);
      }
    }
  }

  private getEmojiForType(type: string): string {
    const emojiMap: { [key: string]: string } = {
      'aventura': '🗺️',
      'fantasia': '🧚',
      'misterio': '🔍',
      'ciencia': '🔬',
      'animales': '🦁',
      'espacio': '🚀',
      'piratas': '🏴‍☠️',
      'magia': '✨',
      'dinosaurios': '🦕',
      'naturaleza': '🌿',
      'humor': '😂',
      'deportes': '⚽',
      'musica': '🎵',
      'arte': '🎨',
      'cocina': '🍰'
    };
    return emojiMap[type] || '📖';
  }
}