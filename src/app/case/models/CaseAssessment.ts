import { IncomingLetter } from './incoming-letter';

export interface CaseAssessment {
  id: number;
  remark: String;
  createdName: String;
  assignee: number;
  incomingLetter: IncomingLetter;
}
