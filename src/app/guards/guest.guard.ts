import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RedirectService } from '../services/redirect.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private redirectService: RedirectService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.afUser$.pipe(
      map((user: firebase.User) => !user),
      tap((isGuest: boolean) => {
        if (!isGuest) {
          this.redirectService.redirectToTop();
        }
      })
    );
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.afUser$.pipe(
      map((user: firebase.User) => !user),
      take(1),
      tap((isGuest: boolean) => {
        if (!isGuest) {
          this.redirectService.redirectToTop();
        }
      })
    );
  }
}
