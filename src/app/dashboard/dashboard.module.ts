import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { StatsComponent } from './components/stats/stats.component';
import { EventCalendarComponent } from './components/event-calendar/event-calendar.component';
import { StaffStatusComponent } from './components/staff-status/staff-status.component';
import { HallAvailabilityComponent } from './components/hall-availability/hall-availability.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { GroupTaskListComponent } from './components/group-task-list/group-task-list.component';
import { MonitorCaseComponent } from './components/monitor-case/monitor-case.component';
import { ScheduleMeetingComponent } from './components/schedule-meeting/schedule-meeting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingCaseComponent } from '@app/jed-service/components/pending-case/pending-case.component';
import { JedServiceModule } from '@app/jed-service/jed-service.module';

@NgModule({
  declarations: [
    DashboardComponent,
    StatsComponent,
    EventCalendarComponent,
    StaffStatusComponent,
    HallAvailabilityComponent,
    UpcomingEventsComponent,
    TaskListComponent,
    GroupTaskListComponent,
    MonitorCaseComponent,
    ScheduleMeetingComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,  
    JedServiceModule,
  ],
  exports: [
    EventCalendarComponent, 
    HallAvailabilityComponent, 
    DashboardComponent
  ],
})
export class DashboardModule {}
