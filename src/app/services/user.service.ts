import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UserData } from '../interfaces/user-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  changeUserName(uid: string, name: string): Promise<void> {
    return this.db.doc<UserData>(`users/${uid}`).update({ name });
  }

  async changeUserAvatar(uid: string, image: string): Promise<void> {
    const result = await this.storage
      .ref(`users/${uid}`)
      .putString(image, 'data_url');
    const avatarURL: string = await result.ref.getDownloadURL();
    return this.db.doc<UserData>(`users/${uid}`).update({ avatarURL });
  }

  addUserCreatedRoomId(uid: string, roomId: string): Promise<void> {
    return this.db.doc(`users/${uid}/createdRoomIds/${roomId}`).set({
      roomId,
      createdAt: new Date(),
    });
  }

  addUserJoinedRoomId(uid: string, roomId: string): Promise<void> {
    return this.db.doc(`users/${uid}/joinedRoomIds/${roomId}`).set({
      roomId,
      joinedAt: new Date(),
    });
  }
}
