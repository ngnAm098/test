import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Credentials, CredentialsService } from '@app/auth';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';

@Component({
  selector: 'app-meeting-hall',
  templateUrl: './meeting-hall.component.html',
  styleUrls: ['./meeting-hall.component.scss'],
})
export class MeetingHallComponent implements OnInit {
  @Output() submitHallBookingDetails: EventEmitter<any> = new EventEmitter<any>();

  credentials: Credentials;

  constructor(private frontDeskService: FrontDeskService, private credentialService: CredentialsService) {}

  ngOnInit(): void {
    this.getScheduledMeeting();
  }

  submitHallBooking() {
    const taskVariables = [
      {
        key: 'meetingHall',
        value: 'submit',
      },
    ];
    this.submitHallBookingDetails.emit(taskVariables);
  }

  userScheduledMeetingList: MeetingHall[];

  getScheduledMeeting() {
    this.frontDeskService.secheduledMeetingByUser(this.credentialService.credentials.userid).subscribe((res) => {
      this.userScheduledMeetingList = res;
    });
  }
}
