// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyB5iTcNuudL3tO-LwUDBk1Y0yZfUgYUViI',
    authDomain: 'team-rabe.firebaseapp.com',
    projectId: 'team-rabe',
    storageBucket: 'team-rabe.appspot.com',
    messagingSenderId: '662780681836',
    appId: '1:662780681836:web:0b28754673663e39168249',
    measurementId: 'G-ZS4ETG20J1',
  },
  line: {
    clientId: '1655563119',
    redirectURI:
      'https://asia-northeast1-team-rabe.cloudfunctions.net/getLineCodeWebhook',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
