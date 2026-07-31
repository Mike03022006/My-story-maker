import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { StepAvatarComponent } from './step-avatar/step-avatar.component';
import { StepInterestsComponent } from './step-interests/step-interests.component';
import { StepPreviewComponent } from './step-preview/step-preview.component';
import { StepSecurityComponent } from './step-security/step-security.component';
import { StoryReaderComponent } from './story-reader/story-reader.component';
import { LockModalComponent } from './lock-modal/lock-modal.component';

@NgModule({
  declarations: [
    StepIndicatorComponent,
    StepAvatarComponent,
    StepInterestsComponent,
    StepPreviewComponent,
    StepSecurityComponent,
    StoryReaderComponent,
    LockModalComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],

  exports: [
    StepIndicatorComponent,
    StepAvatarComponent,
    StepInterestsComponent,
    StepPreviewComponent,
    StepSecurityComponent,
    StoryReaderComponent,
    LockModalComponent
  ]
})
export class ComponentsModule {}