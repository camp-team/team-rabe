import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserData } from '../interfaces/user-data';
import { shareReplay, switchMap } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isProcessing: boolean;
  user: any;
  user$: Observable<UserData> = this.afAuth.user.pipe(
    switchMap((user) => {
      this.user = user;
      if (user) {
        return this.db.doc(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  constructor(
    private fns: AngularFireFunctions,
    private afAuth: AngularFireAuth,
    private snackbar: MatSnackBar,
    private router: Router,
    private db: AngularFirestore
  ) {}

  async loginWithLine(code: string): Promise<void> {
    this.isProcessing = true;
    const callable = this.fns.httpsCallable('getCustomToken');
    const customToken = await callable({ code })
      .toPromise()
      .catch((error) => {
        console.log(error);
        this.router.navigate(['/']);
      });

    if (customToken) {
      this.afAuth
        .signInWithCustomToken(customToken)
        .then(() => {
          this.snackbar.open('ログインしました');
          this.router.navigate(['/']);
        })
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
