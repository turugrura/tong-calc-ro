// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentModel } from './environment.model';

export const environment: EnvironmentModel = {
  production: false,
  surveyUrl: 'https://forms.gle/aUYQKTfDym5Aakz9A',
  issueTrackingUrl:
    'https://docs.google.com/spreadsheets/d/1SBdqO0PzAY2rGawP_pvMAOA2erZK9_V0h2LxvcW-Epc/edit?usp=sharing',
  roBackendUrl: 'http://localhost:3000',
  // roBackendUrl: 'https://prod---ro-backend-7a7aw5iyva-as.a.run.app',
  youtubeVideoUrl: 'https://www.youtube.com/watch?v=ec5U-ZxvoFM&list=PLJi-aEFx61gw97he4dSOWP5-fADXegbyH&index=1&t',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
