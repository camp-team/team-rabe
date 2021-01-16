import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserData } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  changeUserName(uid: string, name: string): Promise<void> {
    return this.db.doc<UserData>(`users/${uid}`).update({ name });
  }
}
