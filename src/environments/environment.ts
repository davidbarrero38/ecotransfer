// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    // Put here your firebase configuration
    apiKey: 'AIzaSyCgW4Meoo2pPRIUps2JT4BpGrIZ5mpEv-Y',
    authDomain: 'eco-transfer.firebaseapp.com',
    databaseURL: 'https://eco-transfer.firebaseio.com',
    projectId: 'eco-transfer',
    storageBucket: 'eco-transfer.appspot.com',
    messagingSenderId: '806184084678',
    appId: '1:806184084678:web:6675426462802bc5'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
