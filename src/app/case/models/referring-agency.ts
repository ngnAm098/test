import { Agency } from '@app/front-desk/models/agency';
import { IncomingLetter } from '@app/front-desk/models/incoming-letter';
import { CaseType } from './case-type';
import { Jurisdiction } from './jurisdiction';

export class ReferringAgency {
  id: number;
  caseName: String;
  referralCaseNo: String;
  forwardingDate: Date;
  offence: String;
  evidence: String;
  remandPeriod: number;
  incomingLetter: any;
  updatedBy: number;
  updatedOn: Date;
  updatedByName: string;
  jurisdiction: any;
  referringAgency: any;
  caseType: any;
  fileName: String;
  moreEvidenceComment: string;
  powerOfAttorney: String;
  examineFact: number;
  dueProcess: number;
  accessEvidence: number;
  remandExtension: number;
  examinationFactComment: String;
  dueProcessComment: String;
  assessEvidenceComment: String;
  taskVariables: any;
  fileLocation: string;
  chiefCommentOnDueProcess: string;
  chargeSheet: any;
  defendants: any;
}
