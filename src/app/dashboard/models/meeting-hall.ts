import { Time } from '@angular/common';

export class MeetingHall {
  meetingTitle: string;
  meetingHall: string;
  meetingDate: Date;
  startTime: Time;
  endTime: Time;
  comment: string;
  scheduler: string;
  updatedOn: Date;
  updatedBy: number;
}
