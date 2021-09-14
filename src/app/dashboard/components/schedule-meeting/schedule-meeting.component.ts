import { EventEmitter } from '@angular/core';
import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { Credentials, CredentialsService } from '@app/auth';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss'],
})
export class ScheduleMeetingComponent implements OnInit {
  @Output() refreshUpcomingEventList: EventEmitter<any> = new EventEmitter<any>();

  timeLists: TimeList[] = [
    { value: '9:00 AM' },
    { value: '9:15 AM' },
    { value: '9:30 AM' },
    { value: '9:45 AM' },
    { value: '10:00 AM' },
    { value: '10:15 AM' },
    { value: '10:30 AM' },
    { value: '10:45 AM' },
    { value: '11:00 AM' },
    { value: '11:15 AM' },
    { value: '11:30 AM' },
    { value: '11:45 AM' },
    { value: '12:00 AM' },
    { value: '12:15 PM' },
    { value: '12:30 PM' },
    { value: '12:45 PM' },
    { value: '1:00 PM' },
    { value: '1:15 PM' },
    { value: '1:30 PM' },
    { value: '1:45 PM' },
    { value: '2:00 PM' },
    { value: '2:25 PM' },
    { value: '2:30 PM' },
    { value: '2:45 PM' },
    { value: '3:00 PM' },
    { value: '3:35 PM' },
    { value: '3:30 PM' },
    { value: '3:45 PM' },
    { value: '4:00 PM' },
    { value: '4:45 PM' },
    { value: '4:40 PM' },
    { value: '4:45 PM' },
    { value: '5:00 PM' },
  ];

  selectedDate: Date;
  scheduleForm: FormGroup;
  credentials: Credentials;
  conferenceHall: any;
  actionType: string;
  enableUpdateButton: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ScheduleMeetingComponent>,
    private fb: FormBuilder,
    private credentialService: CredentialsService,
    private service: FrontDeskService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.selectedDate = this.data.selectedDate;
    this.actionType = this.data.actionType;
    this.initializeForm();
    this.getConferenceHallList();
    this.LoadScheduledMeeting();
    this.getTimeList();
  }

  initializeForm() {
    this.scheduleForm = this.fb.group({
      meetingTitle: new FormControl('', Validators.required),
      meetingHall: new FormControl('', Validators.required),
      meetingDate: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
      comment: [''],
    });

    this.scheduleForm.patchValue({
      meetingDate: this.selectedDate,
    });
  }

  getConferenceHallList() {
    this.service.loadConferenceHall().subscribe((response) => {
      this.conferenceHall = response;
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  addNewTask() {
    const bookMeetingHall = new MeetingHall();
    Object.assign(bookMeetingHall, this.scheduleForm.value);
    bookMeetingHall.updatedOn = new Date();
    bookMeetingHall.scheduler = this.credentials.employeename;
    bookMeetingHall.updatedBy = this.credentials.userid;

    this.service.scheduleMeeting(bookMeetingHall).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Meeting has been scheduled');
        this.dialogRef.close();
        this.refreshUpcomingEventList.emit();
      },
      () => {
        this.notificationService.openErrorSnackBar('Meeting could not be scheduled');
      }
    );
  }

  updateTask() {
    const bookMeetingHall = new MeetingHall();
    Object.assign(bookMeetingHall, this.scheduleForm.value);
    bookMeetingHall.updatedOn = new Date();
    bookMeetingHall.scheduler = this.credentials.employeename;
    bookMeetingHall.updatedBy = this.credentials.userid;

    this.service.updateScheduledMeeting(this.data.meetingId, bookMeetingHall).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Meeting has been scheduled');
        this.dialogRef.close();
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Could not update, please try again later');
      }
    );
  }

  LoadScheduledMeeting() {
    if (this.actionType === 'EDIT') {
      this.service.LoadScheduledMeetingById(this.data.meetingId).subscribe((response) => {
        this.scheduleForm.patchValue({
          meetingTitle: response.meetingTitle,
          meetingHall: response.meetingHall,
          meetingDate: response.meetingDate,
          startTime: response.startTime,
          endTime: response.endTime,
          comment: response.comment,
        });
        this.updateScheduledMeeting(response.updatedBy);
      });
    }
  }

  updateScheduledMeeting(updatedBy: number) {
    if (updatedBy === this.credentials.userid) {
      this.enableUpdateButton = true;
    }
  }

  cancelMeeting() {
    this.service.closeScheduledMeeting(this.data.meetingId).subscribe(
      () => {
        this.dialogRef.close();
        this.notificationService.openSuccessSnackBar('Meeting has been canceled successfully');
      },
      () => {
        this.notificationService.openErrorSnackBar('Could not update, please try again later');
      }
    );
  }

  getTimeList() {
    
    let start_time = {};

    if(this.timeLists[0].value = "10: 00 AM") {

    }

    this.timeLists = [
      { value: '9:00 AM' },
      { value: '9:15 AM' },
      { value: '9:30 AM' },
      { value: '9:45 AM' },
      { value: '10:00 AM' },
      { value: '10:15 AM' },
      { value: '10:30 AM' },
      { value: '10:45 AM' },
      { value: '11:00 AM' },
      { value: '11:15 AM' },
      { value: '11:30 AM' },
      { value: '11:45 AM' },
      { value: '12:00 AM' },
      { value: '12:15 PM' },
      { value: '12:30 PM' },
      { value: '12:45 PM' },
      { value: '1:00 PM' },
      { value: '1:15 PM' },
      { value: '1:30 PM' },
      { value: '1:45 PM' },
      { value: '2:00 PM' },
      { value: '2:25 PM' },
      { value: '2:30 PM' },
      { value: '2:45 PM' },
      { value: '3:00 PM' },
      { value: '3:35 PM' },
      { value: '3:30 PM' },
      { value: '3:45 PM' },
      { value: '4:00 PM' },
      { value: '4:45 PM' },
      { value: '4:40 PM' },
      { value: '4:45 PM' },
      { value: '5:00 PM' },
    ];
  }
}

interface TimeList {
  value: string;
}
