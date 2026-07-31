import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoryDetailPage } from './story-detail.page';

const routes: Routes = [
  {
    path: '',
    component: StoryDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoryDetailPageRoutingModule {}
