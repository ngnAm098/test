import { Dzongkhag } from './dzongkhag';
import { Gewog } from './gewog';
import { Ministry } from './ministry';
import { Village } from './village';

export class Victim {
  id:number;
  victimName: string;
  victimDob: Date;
  victimGender: string;
  victimCid: string;
  nationality: string;
  victimContactNo: number;
  presentAddress: string;
  occupation: String;
  houseNo: string;
  thramNo: string;
  createdBy: number;
  createdOn: Date;
  caseInformation: any;
  updatedBy: number;
  updatedByName: string;
  updatedOn: Date;
  saveType: string;
  ministry: any;
  contactNo: number;
  dzongkhag: any;
  gewog: any;
  village: any;
  caseId:number;
}
