import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ALL_INTERESTS } from '../../services/profile.service';
import { Story } from '../../services/stories.service';
import { TtsService } from '../../services/tts.service';

@Component({
  selector: 'app-story-reader',
  templateUrl: './story-reader.component.html',
  styleUrls: ['./story-reader.component.scss'],
  standalone: false
})
export class StoryReaderComponent implements OnDestroy {
  @Input() story!: Story;

  @Output() close = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<Story>();

  private allInterests = ALL_INTERESTS;
  isReading = false;

  constructor(private ttsService: TtsService) {}

  ngOnDestroy() {
    this.stopReading();
  }

  getGenreLabel(genre: string): string {
    return this.allInterests.find(i => i.id === genre)?.label || genre;
  }

  toggleReading() {
    if (this.isReading) {
      this.stopReading();
    } else {
      this.startReading();
    }
  }

  startReading() {
    if (this.story.content) {
      this.isReading = true;
      this.ttsService.speak(this.story.content);
      
      // Verificar periódicamente si terminó de leer
      const checkInterval = setInterval(() => {
        if (!this.ttsService.isSpeaking()) {
          this.isReading = false;
          clearInterval(checkInterval);
        }
      }, 500);
    }
  }

  stopReading() {
    this.ttsService.stop();
    this.isReading = false;
  }

  onClose() {
    this.stopReading();
    this.close.emit();
  }
}