import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '@app/@core';
import { Credentials, CredentialsService } from '@app/auth';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hall-availability',
  templateUrl: './hall-availability.component.html',
  styleUrls: ['./hall-availability.component.scss'],
})
export class HallAvailabilityComponent implements OnInit {
  //@Input() conferenceHallList: Observable<MeetingHall[]>;

  credentials: Credentials;
  conferenceHallList: MeetingHall[];

  constructor(
    private credentialService: CredentialsService,
    private service: FrontDeskService,
    private notificationService: NotificationService
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.loadConferenceHall();
  }

  loadConferenceHall() {
    this.service.loadConferenceHall().subscribe((response) => {
      this.conferenceHallList = response;
    });
  }
}
