import * as admin from 'firebase-admin';

export interface Room {
  roomId: string;
  ownerId: string;
  name: string;
  description?: string;
  iconURL: string;
  createdAt: Date;
  updatedAt: Date;
  joinedUserIds: string[];
  entrylogs: string[];
}
