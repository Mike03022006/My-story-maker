import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { ProfileGuard } from './guards/profile.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tab1',
    pathMatch: 'full'
  },
  {
    path: 'tab1',
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule),
    canActivate: [GuestGuard]
  },
  {
    path: 'tab2',
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule),
    canActivate: [GuestGuard]
  },
  {
    path: 'tab3',
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard, ProfileGuard]
  },
  {
    path: 'create-story',
    loadChildren: () => import('./pages/create-story/create-story.module').then( m => m.CreateStoryPageModule)
  },
  {
    path: 'story-detail/:id',
    loadChildren: () => import('./pages/story-detail/story-detail.module').then( m => m.StoryDetailPageModule)
  },
  {
    path: 'voice-settings',
    loadChildren: () => import('./pages/voice-settings/voice-settings.module').then( m => m.VoiceSettingsPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./pages/subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}