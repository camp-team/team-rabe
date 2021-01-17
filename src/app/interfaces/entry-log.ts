import * as admin from 'firebase-admin';
import { UserData } from './user-data';

export interface EntryLog {
  userId: string;
  activedRoomId: string;
  entryedAt?: admin.firestore.Timestamp;
  leavedAt?: admin.firestore.Timestamp;
}

export interface EntryLogWithUserData extends EntryLog {
  user: UserData;
}
