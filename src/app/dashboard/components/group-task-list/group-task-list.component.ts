import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NavigationExtras, Router } from '@angular/router';
import { Task } from '@app/dashboard/models/task';
import { ViewTask } from '@app/dashboard/models/view-task';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-group-task-list',
  templateUrl: './group-task-list.component.html',
  styleUrls: ['./group-task-list.component.scss'],
})
export class GroupTaskListComponent implements OnInit {
  @Input() groupPendingTasks: Observable<Task[]>;
  @Input() userOngoingTasks: Observable<Task[]>;
  @Output() details: EventEmitter<ViewTask> = new EventEmitter<ViewTask>();

  displayedColumns: string[] = [
    'From',
    'letterNo',
    'letterDate',
    'Subject',
    'SenderName',
    'ReceiptNo',
    'caseStatus',
    'open',
  ];

  displayedColumns2: string[] = ['From', 'letterNo', 'letterDate', 'Subject', 'SenderName', 'ReceiptNo', 'open'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  loadCaseDetails(incomingLetterId: number) {
    let navExtras: NavigationExtras = {
      queryParams: {
        incomingLetterId,
      },
    };
    this.router.navigate(['/case-assignment'], navExtras);
  }
}
