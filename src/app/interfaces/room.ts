import * as admin from 'firebase-admin';

export interface Room {
  roomId: string;
  ownerId: string;
  name: string;
  description?: string;
  iconURL: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  joinedUserIds: string[];
  entrylogs: string[];
}
