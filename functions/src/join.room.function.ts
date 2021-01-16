import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { shouldEventRun, markEventTried } from './utils/firebase.utils';
import request = require('request');
import { LineClient } from 'messaging-api-line';

const db = admin.firestore();

const client = new LineClient({
  accessToken: functions.config().line.message_token,
  channelSecret: functions.config().line.message_secret,
});

export const joinRoomAndReplyMessage = functions
  .region('asia-northeast1')
  .runWith({ memory: '1GB' })
  .https.onRequest(async (req: any, res: any) => {
    const event = req.body.events[0];
    const userId = event.source.userId;
    const timestamp = admin.firestore.Timestamp.now();
    const replyToken = event.replyToken;
    let userText = '';
    if (event.type === 'message' && event.message.type === 'text') {
      userText = event.message.text;
      functions.logger.info(userText);
      functions.logger.info(event.message);
    } else {
      userText = '(Message type is not text)';
    }

    await db.collection('users').doc(userId).update({
      userId,
      activeRoomId: userText,
      joinedAt: timestamp,
    });

    await db
      .collection('users')
      .doc(userId)
      .get()
      .then(async (user: any) => {
        if (user.exists) {
          const name = user.data().name;

          await db
            .collection('rooms')
            .doc(userText)
            .get()
            .then(async (room: any) => {
              const iconURL = room.data().iconURL;
              const roomName = room.data().name;

              await client.replyFlex(event.replyToken, 'this is a message', {
                type: 'bubble',
                hero: {
                  type: 'image',
                  url: `${iconURL}`,
                  size: 'full',
                  aspectRatio: '20:13',
                  aspectMode: 'cover',
                  action: {
                    type: 'uri',
                    label: 'Line',
                    uri: `http://localhost:4200/room-detail/${userText}`,
                  },
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `${name}さん`,
                      size: 'xl',
                      weight: 'bold',
                    },
                    {
                      type: 'box',
                      layout: 'baseline',
                      margin: 'md',
                      contents: [
                        {
                          type: 'text',
                          text: `${roomName}のメンバーになりました！`,
                          flex: 0,
                          margin: 'md',
                          size: 'md',
                          color: '#000000',
                        },
                      ],
                    },
                  ],
                },
              });
            });
        } else {
          replyMessage(replyToken, 'You are not the customer, Register?');
        }
        return null;
      })
      .catch((err) => {
        functions.logger.error(err);
      });

    return res.status(200).send(req.method);
  });

const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${client.accessToken}`,
};

function replyMessage(replyToken: any, textfrom: any): request.Request {
  return request.post({
    uri: `https://api.line.me/v2/bot/message/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken,
      messages: [
        {
          type: 'text',
          text: textfrom,
        },
      ],
    }),
  });
}

export const countUpMember = functions
  .region('asia-northeast1')
  .firestore.document('rooms/{roomId}/joinedUserIds/{uid}')
  .onCreate(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should) => {
      if (should) {
        await db
          .doc(`rooms/${context.params.roomId}`)
          .update('memberCount', admin.firestore.FieldValue.increment(1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });

export const countDownMember = functions
  .region('asia-northeast1')
  .firestore.document('rooms/{roomId}/joinedUserIds/{uid}')
  .onDelete(async (snap, context) => {
    const eventId = context.eventId;
    return shouldEventRun(eventId).then(async (should) => {
      if (should) {
        await db
          .doc(`rooms/${context.params.roomId}`)
          .update('memberCount', admin.firestore.FieldValue.increment(-1));
        return markEventTried(eventId);
      } else {
        return;
      }
    });
  });
