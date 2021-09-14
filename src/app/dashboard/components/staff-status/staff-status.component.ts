import { Component, Input, OnInit } from '@angular/core';
import { Staff } from '@app/dashboard/models/staff';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-staff-status',
  templateUrl: './staff-status.component.html',
  styleUrls: ['./staff-status.component.scss'],
})
export class StaffStatusComponent implements OnInit {
  @Input() staffStatus: Observable<Staff[]>;
  public displayedColumns: string[] = ['staffName', 'status'];

  constructor() {}

  ngOnInit(): void {}
}
