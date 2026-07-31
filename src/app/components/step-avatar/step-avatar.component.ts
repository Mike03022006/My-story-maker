import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-step-avatar',
  templateUrl: './step-avatar.component.html',
  styleUrls: ['./step-avatar.component.scss'],
  standalone: false
})
export class StepAvatarComponent {
  @Input() selectedAvatar = '';
  @Input() profileName = '';
  @Input() profileAge = 7;
  @Input() isEditMode = false;
  @Input() isSaving = false;
  @Input() error = '';

  @Output() avatarChange = new EventEmitter<string>();
  @Output() nameChange = new EventEmitter<string>();
  @Output() ageChange = new EventEmitter<number>();
  @Output() next = new EventEmitter<void>();

  showAvatarPicker = false;
  showGenericAvatars = false;

  genericAvatars = [
    { emoji: '🦁' }, { emoji: '🐼' }, { emoji: '🦊' }, { emoji: '🐸' },
    { emoji: '🦄' }, { emoji: '🐉' }, { emoji: '🐧' }, { emoji: '🦋' },
    { emoji: '🐨' }, { emoji: '🦝' }, { emoji: '🐺' }, { emoji: '🦔' },
  ];

  isEmojiAvatar(avatar: string): boolean {
    if (!avatar) return false;
    return !avatar.startsWith('data:') && !avatar.startsWith('assets/') && !avatar.startsWith('http');
  }

  openAvatarPicker() {
    this.showAvatarPicker = !this.showAvatarPicker;
    if (!this.showAvatarPicker) this.showGenericAvatars = false;
  }

  async pickFromCamera() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80, allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      if (photo.dataUrl) {
        this.avatarChange.emit(photo.dataUrl);
        this.showAvatarPicker = false;
      }
    } catch (e) { console.log('Camera error', e); }
  }

  async pickFromGallery() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80, allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });
      if (photo.dataUrl) {
        this.avatarChange.emit(photo.dataUrl);
        this.showAvatarPicker = false;
      }
    } catch (e) { console.log('Gallery error', e); }
  }

  selectGenericAvatar(emoji: string) {
    this.avatarChange.emit(emoji);
    this.showAvatarPicker = false;
    this.showGenericAvatars = false;
  }

  onNameInput(value: string) {
    this.nameChange.emit(value);
  }

  changeAge(delta: number) {
    const newAge = Math.max(3, Math.min(14, this.profileAge + delta));
    this.ageChange.emit(newAge);
  }
}