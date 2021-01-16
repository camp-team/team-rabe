import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

export const db = admin.firestore();

db.settings({
  ignoreUndefinedProperties: true,
});

const CLIENT_ID = functions.config().line.client_id;
const CLIENT_SECRET = functions.config().line.client_secret;

export const createState = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    const state: string = admin.firestore().collection('_').doc().id;
    await admin.firestore().doc(`states/${state}`).set({ state });
    return state;
  });

export const getLineCodeWebhook = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    const isValidState = (await admin.firestore().doc(`states/${state}`).get())
      .exists;

    if (!isValidState) {
      return;
    }

    if (code) {
      res.redirect(`http://localhost:4200/welcome?code=${code}`);
    } else {
      res.redirect(`http://localhost:4200`);
    }
  });

const getAccessToken = async (code: string) => {
  return fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:
        'https://asia-northeast1-team-rabe.cloudfunctions.net/getLineCodeWebhook',
    }),
  }).then(async (r) => {
    const res = await r.json();
    return res;
  });
};

export const getCustomToken = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    if (!data) {
      return;
    }

    const lineUser = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id_token: (await getAccessToken(data.code)).id_token,
        client_id: CLIENT_ID,
      }),
    }).then(async (r) => {
      const res = await r.json();
      return res;
    });

    let uid: string = context.auth?.uid as string;

    const connectedUser = (
      await admin
        .firestore()
        .collection('users')
        .where('uid', '==', lineUser.sub)
        .get()
    ).docs[0];

    if (uid && !connectedUser) {
      await admin.firestore().doc(`users/${uid}`).set(
        {
          lineId: lineUser.sub,
        },
        { merge: true }
      );
    } else if (!uid && connectedUser) {
      uid = connectedUser.id;
    } else if (!uid && !connectedUser) {
      uid = lineUser.sub;
      await admin.firestore().doc(`users/${uid}`).set(
        {
          uid: lineUser.sub,
          name: lineUser.name,
          avatarURL: lineUser.picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    return await admin.auth().createCustomToken(uid);
  });
