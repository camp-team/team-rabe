import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { combineLatest, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Room } from '../interfaces/room';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async changeRoomIconURL(roomId: string, url: string): Promise<void> {
    const result = await this.storage
      .ref(`rooms/${roomId}`)
      .putString(url, 'data_url');

    const iconURL = await result.ref.getDownloadURL();

    return this.db.doc(`rooms/${roomId}`).set(
      {
        iconURL,
      },
      { merge: true }
    );
  }

  getRoom(id: string): Observable<Room> {
    return this.db.doc<Room>(`rooms/${id}`).valueChanges();
  }

  async updateRoom(room: Omit<Room, 'createdAt' | 'ownerId'>): Promise<void> {
    await this.changeRoomIconURL(room.roomId, room.iconURL);
    this.db
      .doc<Omit<Room, 'iconURL' | 'createdAt' | 'ownerId'>>(
        `rooms/${room.roomId}`
      )
      .set({
        ...room,
        updatedAt: new Date(),
      });
  }

  async createRoom(room: Omit<Room, 'createdAt' | 'roomId'>): Promise<string> {
    const id = this.db.createId();
    await this.changeRoomIconURL(id, room.iconURL);
    this.db.doc<Room>(`rooms/${id}`).set({
      ...room,
      createdAt: new Date(),
      roomId: id,
    });
    return id;
  }

  getCreatedRooms(uid: string): Observable<Room[]> {
    return this.db
      .collection(`users/${uid}/createdRoomIds`)
      .valueChanges()
      .pipe(
        switchMap((roomIds: { roomId: string }[]) => {
          const room$$: Observable<Room>[] = roomIds.map(
            (doc: { roomId: string }) => this.getRoom(doc.roomId)
          );
          return combineLatest(room$$);
        })
      );
  }
}
