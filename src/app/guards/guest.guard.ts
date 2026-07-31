import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      const uid = this.auth.currentUser!.uid;
      if (this.profileService.isProfileComplete(uid)) {
        this.router.navigate(['/tabs']);
      } else {
        this.router.navigate(['/tab3']);
      }
      return false;
    }
    return true;
  }
}