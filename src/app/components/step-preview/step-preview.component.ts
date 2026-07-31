import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ALL_INTERESTS } from '../../services/profile.service';

@Component({
  selector: 'app-step-preview',
  templateUrl: './step-preview.component.html',
  styleUrls: ['./step-preview.component.scss'],
  standalone: false
})
export class StepPreviewComponent {
  @Input() selectedAvatar = '';
  @Input() profileName = '';
  @Input() profileAge = 7;
  @Input() selectedInterests: string[] = [];

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  private allInterests = ALL_INTERESTS;

  isEmojiAvatar(avatar: string): boolean {
    if (!avatar) return false;
    return !avatar.startsWith('data:') && !avatar.startsWith('assets/') && !avatar.startsWith('http');
  }

  getInterestIcon(id: string): string {
    return this.allInterests.find(i => i.id === id)?.icon || '';
  }

  getInterestLabel(id: string): string {
    return this.allInterests.find(i => i.id === id)?.label || id;
  }
}