import { TestBed } from '@angular/core/testing';

import { VoiceSettings } from './voice-settings';

describe('VoiceSettings', () => {
  let service: VoiceSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
