import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { shareReplay, switchMap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { RedirectService } from './redirect.service';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isProcessing: boolean;
  uid: string;
  user$: Observable<UserData> = this.afAuth.user.pipe(
    switchMap((user) => {
      if (user) {
        return this.db.doc(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  afUser$: Observable<firebase.User> = this.afAuth.user;

  constructor(
    private fns: AngularFireFunctions,
    public afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private db: AngularFirestore,
    private redirectService: RedirectService,
    private router: Router
  ) {
    this.afUser$.subscribe((user: firebase.User) => (this.uid = user.uid));
  }

  async loginWithLine(code: string): Promise<void> {
    this.isProcessing = true;
    const callable = this.fns.httpsCallable('getCustomToken');
    const customToken = await callable({ code })
      .toPromise()
      .catch((error) => {
        console.log(error);
        this.redirectService.redirectToTop();
      });
    console.log(customToken);

    if (customToken) {
      console.log(customToken);
      this.afAuth
        .signInWithCustomToken(customToken)
        .catch((error) => {
          console.log('ログイン失敗');
          console.error(error);
        })
        .finally(() => (this.isProcessing = false));
    }
  }

  logout(): void {
    this.afAuth.signOut();
    this.router
      .navigate(['/welcome'], {
        queryParams: null,
      })
      .then(() => this.snackbar.open('ログアウトしました'));
  }
}
