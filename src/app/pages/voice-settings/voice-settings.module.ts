import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoiceSettingsPageRoutingModule } from './voice-settings-routing.module';

import { VoiceSettingsPage } from './voice-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoiceSettingsPageRoutingModule
  ],
  declarations: [VoiceSettingsPage]
})
export class VoiceSettingsPageModule {}
