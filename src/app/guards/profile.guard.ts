import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Injectable({ providedIn: 'root' })
export class ProfileGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      this.router.navigate(['/tab1']);
      return false;
    }
    
    // Ensure profile is loaded asynchronously before checking completeness
    const existing = await this.profileService.loadProfile(uid);
    if (existing?.isProfileComplete) {
      return true;
    }

    this.router.navigate(['/tab3']);
    return false;
  }
}