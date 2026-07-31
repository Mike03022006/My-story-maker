import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoryDetailPageRoutingModule } from './story-detail-routing.module';

import { StoryDetailPage } from './story-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoryDetailPageRoutingModule
  ],
  declarations: [StoryDetailPage]
})
export class StoryDetailPageModule {}
