import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { Employee } from '@app/master/models/employee';
import { MasterService } from '@app/master/services/master.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent implements OnInit {
  employeeList: Observable<Employee[]>;
  public refreshData$ = new BehaviorSubject<boolean>(false);
  displayedColumns: string[] = [
    'SlNo',
    'EmployeeName',
    'Designation',
    'Cid',
    'EmployeeNumber',
    'Organization',
    'Department',
    'Division',
    'edit',
    'delete',
  ];

  constructor(
    public dialog: MatDialog,
    public service: MasterService,
    public notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.employeeList = this.refreshData$.pipe(switchMap((_) => this.service.loadEmployeeList()));
  }
  openAddModal() {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '700px',
      data: {
        actionType: 'NEW',
        employeeId: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveEmployee(result);
      }
    });
  }

  saveEmployee(employee: Employee) {
    this.service.saveEmployee(employee).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Employee successfully added');
        this.refreshData$.next(true);
      },
      () => {
        this.notificationService.openErrorSnackBar('Employee couldnot be saved, please try again');
      }
    );
  }

  editEmployee(employeeId: number) {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '700px',
      data: {
        actionType: 'EDIT',
        employeeId: employeeId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveEmployee(result);
      }
    });
  }

  deleteEmployee(employeeId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete the selected employee?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteEmployee(employeeId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Employee deleted successfully');
            this.refreshData$.next(true);
          },
          () => {
            this.notificationService.openErrorSnackBar('Employee couldnot be delete, try again');
          }
        );
      }
    });
  }
}
