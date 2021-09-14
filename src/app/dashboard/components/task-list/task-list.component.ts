import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Task } from '@app/dashboard/models/task';
import { ViewTask } from '@app/dashboard/models/view-task';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  @Input() userPendingTasks: Observable<Task[]>;
  @Output() details: EventEmitter<ViewTask> = new EventEmitter<ViewTask>();

  displayedColumns: string[] = ['From', 'letterNo', 'letterDate', 'Subject', 'SenderName', 'ReceiptNo', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {}

  ngOnInit(): void {}

  loadDetails(incomingLetterId: number, taskInstanceId: number, formKey: string, caseInformation: any) {
    const viewTask = new ViewTask();
    viewTask.incomingLetterId = incomingLetterId;
    viewTask.taskInstanceId = taskInstanceId;
    viewTask.formKey = formKey;
    if (caseInformation) {
      viewTask.caseId = caseInformation.id;
    }
    this.details.emit(viewTask);
  }
}
