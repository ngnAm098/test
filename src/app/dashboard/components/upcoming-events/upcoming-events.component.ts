import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Credentials, CredentialsService } from '@app/auth';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { Observable } from 'rxjs';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.scss'],
})
export class UpcomingEventsComponent implements OnInit {
  // @Output() refreshUpcomingEventList: EventEmitter<any> = new EventEmitter<any>();
  //@Input() scheduledMeetingList: Observable<MeetingHall[]>;

  scheduledMeetingList: MeetingHall[];
  credentials: Credentials;
  secheduledList: any;

  constructor(
    private credentialService: CredentialsService,
    public dialog: MatDialog,
    private frontDeskService: FrontDeskService
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.loadScheduledMeeting();
  }

  loadScheduledMeeting() {
    this.frontDeskService.secheduledMeeting().subscribe((res) => {
      this.scheduledMeetingList = res;
    });
  }

  meetingDetails(meetingId: number) {
    const dialogRef = this.dialog.open(ScheduleMeetingComponent, {
      width: '600px',
      data: {
        actionType: 'EDIT',
        meetingId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      //this.refreshUpcomingEventList.emit();
    });
  }
}
