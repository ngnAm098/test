// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// `.env.ts` is generated by the `npm run env` command
// `npm run env` exposes environment variables as JSON for any usage you might
// want, like displaying the version or getting extra config from your CI bot, etc.
// This is useful for granularity you might need beyond just the environment.
// Note that as usual, any environment variables you expose through it will end up in your
// bundle, and you should not use it for any sensitive information like passwords or keys.

export const environment = {
  production: false,
  version: '11',
  serverUrl: 'http://localhost:1215',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  examinFact: 'isFactsOk',
  dueProcess: 'dueProcessFollowed',
  accesEvidence: 'moreEvidence',
  subcorpus: 'isSubcorpusRequired',
  corpus: 'corpusMeetingRequired',

  judgementAttachment: 'judgement',
  powerOfAttorneyAttachment: 'powerOfAttorney',
  caseAttachment: 'caseFile',
  appeal: 'appeal',
  enforcementRequired: 'enforcementRequired',
  appealAfterSubCorpus: 'appealAfterSubCorpus',

  templateURL: 'http://127.0.0.1:8887/',
  caseFile: 'https://www.ngn.bt/uploads/oagUploads/CivilServiceAct2010ED.pdf',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.