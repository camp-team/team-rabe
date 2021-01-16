import * as admin from 'firebase-admin';

export interface UserData {
  uId: string;
  name: string;
  avatarURL: string;
  activeRoomId: string;
  joinedRoomIds: string[];
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}
