import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(private router: Router) {}

  redirectToTop(): void {
    this.router.navigateByUrl('/');
  }

  redirectToWelcome(): void {
    this.router.navigateByUrl('/welcome');
  }

  redirectToRoomDetail(id: string): void {
    this.router.navigate(['room-detail', id]);
  }

  redirectToSettings(): void {
    this.router.navigateByUrl('settings');
  }
}
