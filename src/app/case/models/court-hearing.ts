import { Defendant } from './defendant';

export class CourtHearing {
  id: number;
  hearingStage: string;
  comment: string;
  hearingDate: Date;
  defendantInformation: any;
}
