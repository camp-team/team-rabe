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

export const lineMessageApi = functions
  .region('asia-northeast1')
  .runWith({ memory: '1GB' })
  .https.onRequest(async (req: any, res: any) => {
    const event = req.body.events[0];
    const userId = event.source.userId;
    const timestamp = admin.firestore.Timestamp.now();
    const replyToken = event.replyToken;

    let userText = '';

    const activeRoomId = await db
      .collection('users')
      .doc(userId)
      .get()
      .then(async (user: any) => {
        if (user.data().activeRoomId) {
          return user.data().activeRoomId;
        } else {
          return null;
        }
      });

    // 初めてかそうじゃないか
    if (!activeRoomId) {
      // 初めてかつなんらかのテキストを送信した人
      if (event.type === 'message' && event.message.type === 'text') {
        userText = event.message.text;
        const isRoomId = await db
          .collection('rooms')
          .doc(userText)
          .get()
          .then(
            async (data: any): Promise<boolean | undefined> => {
              if (data.exists) {
                return true;
              } else {
                return;
              }
            }
          );
        // テキストがルームIDだったらルームにジョイン
        if (isRoomId) {
          await db
            .collection('rooms')
            .doc(userText)
            .collection('joinedUserIds')
            .doc(userId)
            .set({
              userId,
              activeRoomId: userText,
              joinedAt: timestamp,
            });

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
                  .collection('users')
                  .doc(userId)
                  .collection('joinedRoomIds')
                  .doc(userText)
                  .set({
                    joinedRoomId: userText,
                    joinedAt: timestamp,
                  });

                await db
                  .collection('rooms')
                  .doc(userText)
                  .get()
                  .then(async (room: any) => {
                    const iconURL = room.data().iconURL;
                    const newRoomName = room.data().name;

                    functions.logger.info(activeRoomId);
                    functions.logger.info(event.message);
                    functions.logger.info(userId);
                    functions.logger.info('ジョイン');

                    await client.replyFlex(
                      event.replyToken,
                      'this is a message',
                      {
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
                              text: `ようこそ、${name}さん`,
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
                                  text: `${newRoomName}のメンバーになりました！`,
                                  flex: 0,
                                  margin: 'md',
                                  size: 'md',
                                  color: '#000000',
                                },
                              ],
                            },
                          ],
                        },
                      }
                    );
                  });
              }
            });
        }
        // テキストがルームID以外だったら
        else {
          replyMessage(
            replyToken,
            'まずはルームIDを入力してルームのメンバーになりましょう！'
          );
        }
      }
      // 初めてかつテキスト以外を送信したら
      else {
        replyMessage(
          replyToken,
          'まずはルームIDを入力してルームのメンバーになりましょう！'
        );
      }
      return res.status(200).send(req.method);
    }
    // 初めてじゃなければ
    else {
      // 2回目以降で、テキストを送信したら
      if (event.type === 'message' && event.message.type === 'text') {
        // 2回目以降で、送信したのがテキストで、すでにアクティブなルームがある人
        if (activeRoomId !== null) {
          userText = event.message.text;
          const isRoomId = await db
            .collection('rooms')
            .doc(userText)
            .get()
            .then(
              async (data: any): Promise<boolean | undefined> => {
                if (data.exists) {
                  return true;
                } else {
                  return;
                }
              }
            );
          // 2回目以降で、送信したのがテキストで、すでにアクティブなルームがある人で、ルームID以外を送信した人
          if (!isRoomId) {
            const roomName = await db
              .collection('rooms')
              .doc(activeRoomId)
              .get()
              .then(async (user: any) => {
                if (user.exists) {
                  return user.data().name;
                } else {
                  return null;
                }
              });

            if (event.message.text === '入店する') {
              const logId = db.collection('_').doc().id;
              await db
                .collection('rooms')
                .doc(activeRoomId)
                .collection('entrylogs')
                .doc(logId)
                .set({
                  userId,
                  activeRoomId,
                  entryedAt: timestamp,
                });

              replyMessage(
                replyToken,
                `いらっしゃいませ！${roomName}に入店しました🎉`
              );
            } else if (event.message.text === '退店する') {
              const logId = db.collection('_').doc().id;
              await db
                .collection('rooms')
                .doc(activeRoomId)
                .collection('entrylogs')
                .doc(logId)
                .set({
                  userId,
                  activeRoomId,
                  leavedAt: timestamp,
                });

              replyMessage(
                replyToken,
                `ありがとうございました！${roomName}から退店しました。`
              );
            } else if (event.message.text === 'お店の状況を確認する') {
              await db
                .collection('rooms')
                .doc(activeRoomId)
                .get()
                .then(async (room: any) => {
                  const iconURL = room.data().iconURL;
                  const activeRoomName = room.data().name;

                  await client.replyFlex(event.replyToken, 'this is a link', {
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
                        uri: `http://localhost:4200/room-detail/${activeRoomId}`,
                      },
                    },
                    body: {
                      type: 'box',
                      layout: 'vertical',
                      contents: [
                        {
                          type: 'text',
                          text: `${activeRoomName}の状況確認ですね？`,
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
                              text: `上の画像をクリックすると今の状況を確認できます🔖`,
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
            } else if (event.message.text === 'ルームから出る') {
              const logId = db.collection('_').doc().id;
              await db
                .collection('rooms')
                .doc(activeRoomId)
                .collection('entrylogs')
                .doc(logId)
                .set({
                  userId,
                  activeRoomId,
                  leavedAt: timestamp,
                  leavedRoomAt: timestamp,
                });

              await db.collection('users').doc(userId).update({
                activeRoomId: '',
              });

              replyMessage(
                replyToken,
                `ありがとうございました！${roomName}のルームから出ました。他のルームに入室するには、再度ルームのIDを送信してください🙇‍♂️`
              );
            }
            // 2回目以降で、送信したのがテキストで、すでにアクティブなルームがある人で、ルームID以外を送信した人でメニューから送信以外のアクションをした人
            else {
              replyMessage(
                replyToken,
                `すみません、メニューから選んでください🙏`
              );
            }
          }
          // 2回目以降で、送信したのがテキストで、すでにアクティブなルームがある人で、さらにルームIDを送信した人
          else {
            replyMessage(
              replyToken,
              `すみません、一度ルームから出てから別のルームIDを送信してください🙏`
            );
          }
        }
        // 2回目以降で、送信したのがテキストで、今アクティブなルームがない人
        else {
          userText = event.message.text;
          const isRoomId = await db
            .collection('rooms')
            .doc(userText)
            .get()
            .then(
              async (data: any): Promise<boolean | undefined> => {
                if (data.exists) {
                  return true;
                } else {
                  return;
                }
              }
            );
          // 2回目以降で、送信したのがテキストで、今アクティブなルームがない人で、送信したのがルームIDだった人
          if (isRoomId) {
            await db
              .collection('rooms')
              .doc(userText)
              .collection('joinedUserIds')
              .doc(userId)
              .set({
                userId,
                activeRoomId: userText,
                joinedAt: timestamp,
              });

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
                    .collection('users')
                    .doc(userId)
                    .collection('joinedRoomIds')
                    .doc(userText)
                    .set({
                      joinedRoomId: userText,
                      joinedAt: timestamp,
                    });

                  await db
                    .collection('rooms')
                    .doc(userText)
                    .get()
                    .then(async (room: any) => {
                      const iconURL = room.data().iconURL;
                      const newRoomName = room.data().name;

                      await client.replyFlex(
                        event.replyToken,
                        'this is a message',
                        {
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
                                text: `ようこそ、${name}さん`,
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
                                    text: `${newRoomName}のメンバーになりました！`,
                                    flex: 0,
                                    margin: 'md',
                                    size: 'md',
                                    color: '#000000',
                                  },
                                ],
                              },
                            ],
                          },
                        }
                      );
                    });
                }
              });
          }
          // 2回目以降で、送信したのがテキストで、今アクティブなルームがない人で、送信したのがルームID以外だった人
          else {
            replyMessage(
              replyToken,
              'まずはルームIDを入力してルームのメンバーになりましょう！'
            );
          }
        }
      }
      // 2回目以降でテキスト以外を送信したら
      else {
        replyMessage(replyToken, 'すみません、メニューから選んでください🙏');
      }
      return res.status(200).send(req.method);
    }
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
