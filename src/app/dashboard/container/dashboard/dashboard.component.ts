import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { MeetingHall } from '@app/dashboard/models/meeting-hall';
import { Staff } from '@app/dashboard/models/staff';
import { StatData } from '@app/dashboard/models/stat-data';
import { Task } from '@app/dashboard/models/task';
import { ViewTask } from '@app/dashboard/models/view-task';
import { DashboardService } from '@app/dashboard/services/dashboard-service';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public underCorpusData$: Observable<StatData>;
  public ongoingData$: Observable<StatData>;
  public appealedData$: Observable<StatData>;
  public closedData$: Observable<StatData>;
  public staffPresentStatus$: Observable<Staff[]>;
  public userPendingTasks$: Observable<Task[]>;
  public groupPendingTasks$: Observable<Task[]>;
  public userOngoingTasks$: Observable<Task[]>;
  public caseToMonitor$: Observable<Task[]>;
  public refreshUpcomingEvent$ = new BehaviorSubject<boolean>(false);
  public refreshConferenceHallEvent$ = new BehaviorSubject<boolean>(false);

  public scheduledMeetingList$: Observable<MeetingHall[]>;
  public refreshConferenceHallList$: Observable<MeetingHall[]>;

  credentials = this.credentialsService.credentials;

  isLoading = false;

  constructor(
    private service: DashboardService,
    private credentialsService: CredentialsService,
    private router: Router,
    private frontDeskService: FrontDeskService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.underCorpusData$ = this.service.loadUnderCorpusData();
    this.ongoingData$ = this.service.loadOngoingData();
    this.appealedData$ = this.service.loadAppealedData();
    this.closedData$ = this.service.loadClosedData();
    this.staffPresentStatus$ = this.service.loadStaffPresentStatus();

    this.scheduledMeetingList$ = this.refreshUpcomingEvent$.pipe(
      switchMap((_) => this.frontDeskService.secheduledMeeting())
    );
    this.refreshConferenceHallList$ = this.refreshConferenceHallEvent$.pipe(
      switchMap((_) => this.frontDeskService.loadConferenceHall())
    );

    // if (this.role !== 'FrontDesk') { 
    //   this.userPendingTasks$ = this.service.loadUserTaskList(this.credentials.userid);
    //   if (this.role === 'Prosecutor') {
    //     this.groupPendingTasks$ = this.service.loadGroupTaskList(this.credentials.userid);
    //     this.userOngoingTasks$ = this.service.onGoingTaskList(this.credentials.userid);
    //   } else {
    //     this.caseToMonitor$ = this.service.loadCaseToMonitor();
    //   }
    // } else {
    //   this.caseToMonitor$ = this.service.loadCaseToMonitor();
    // }
    this.isLoading = false;
  }

  get role(): string | null {
    return this.credentials ? this.credentials.role : null;
  }

  refreshUpcomingEventList(e: any) {
    this.refreshUpcomingEvent$.next(true);
    this.refreshConferenceHallEvent$.next(true);
  }

  openCaseDetails(viewTask: ViewTask) {
    let navExtras: NavigationExtras = {
      queryParams: {
        incomingLetterId: viewTask.incomingLetterId,
        taskInstanceId: viewTask.taskInstanceId,
        formKey: viewTask.formKey,
        caseId: viewTask.caseId,
      },
    };
    this.router.navigate(['/case'], navExtras);
  }
}
