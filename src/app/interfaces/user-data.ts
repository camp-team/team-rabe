import * as admin from 'firebase-admin';

export interface UserData {
  uid: string;
  name: string;
  avatarURL?: string;
  activeRoomId: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
