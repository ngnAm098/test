import { EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LetterReceiptComponent } from '@app/front-desk/components';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
})
export class EventCalendarComponent implements OnInit {
  selectedDate: any;
  formKey: string;
  @Output() refreshUpcomingEventList: EventEmitter<any> = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.formKey = params.formKey;
    });
  }

  onSelect(event: any) {
    this.selectedDate = event;
  }

  scheduleMeeting() {
    const dialogRef = this.dialog.open(ScheduleMeetingComponent, {
      width: '600px',
      data: {
        actionType: 'ADD',
        selectedDate: this.selectedDate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.refreshUpcomingEventList.emit();
    });
  }

  openAddModal() {
    const dialogRef = this.dialog.open(LetterReceiptComponent, {
      width: '700px',
      data: {
        actionType: 'NEW',
        incomingLetterId: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(['/front-desk']);
      }
    });
  }
}
