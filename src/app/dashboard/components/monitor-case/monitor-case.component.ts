import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Credentials, CredentialsService } from '@app/auth';
import { Task } from '@app/dashboard/models/task';
import { ViewTask } from '@app/dashboard/models/view-task';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monitor-case',
  templateUrl: './monitor-case.component.html',
  styleUrls: ['./monitor-case.component.scss'],
})
export class MonitorCaseComponent implements OnInit {
  @Input() caseToMonitor: Observable<Task[]>;
  @Output() details: EventEmitter<ViewTask> = new EventEmitter<ViewTask>();

  displayedColumns: string[] = [
    'From',
    'letterNo',
    'letterDate',
    'Subject',
    'SenderName',
    'ReceiptNo',
    'caseStatus',
    'addedOn',
    'prosecutor',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  title: string;
  credentials: Credentials;

  constructor(private router: Router, private credentialService: CredentialsService) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    if (this.credentials.role === 'Registrar') {
      this.title = 'Case Registered';
    } else {
      this.title = 'Monitor Case';
    }
  }

  loadCaseDetails(incomingLetterId: number) {}
}
