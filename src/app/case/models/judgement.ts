export class JudgementModel {
  id: number;
  caseOutCome: string;
  appealDate: Date;
  judgementNo: string;
  judgementDate: Date;
  charges: string;
  judgementRemark: string;
  court: string;
  updatedOn: Date;
  updatedBy: number;
  updateByName: string;
  caseInformation: any;
  taskVariables: any;
  fileToUpload: File;
  fileName: string;
  defendantInformation: any;
  sentencingRange: string;
  dzongkhag: string;
  subject: string;
  body: string;
  otherGrounds: string;
}
