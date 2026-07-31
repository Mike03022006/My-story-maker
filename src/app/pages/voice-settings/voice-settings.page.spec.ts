import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoiceSettingsPage } from './voice-settings.page';

describe('VoiceSettingsPage', () => {
  let component: VoiceSettingsPage;
  let fixture: ComponentFixture<VoiceSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
