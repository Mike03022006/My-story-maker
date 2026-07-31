import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoiceSettingsPage } from './voice-settings.page';

const routes: Routes = [
  {
    path: '',
    component: VoiceSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoiceSettingsPageRoutingModule {}
