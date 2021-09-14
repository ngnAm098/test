import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { User } from '@app/master/models/user';
import { MasterService } from '@app/master/services/master.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements AfterViewInit {
  dataSource = new MatTableDataSource();
  // userList: User[];
  public refreshData$ = new BehaviorSubject<boolean>(false);
  displayedColumns: string[] = ['SlNo', 'EmployeeName', 'UserName', 'RoleName', 'edit', 'delete'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public service: MasterService,
    public notificationService: NotificationService
  ) {}

  ngAfterViewInit() {
    this.service.loadUserList().subscribe((res) => (this.dataSource.data = res));
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddModal() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '700px',
      data: {
        actionType: 'NEW',
        userId: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveUser(result);
      }
    });
  }

  saveUser(user: User) {
    this.service.saveUser(user).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('User successfully added');
        this.refreshData$.next(true);
      },
      () => {
        this.notificationService.openErrorSnackBar('User couldnot be saved, please try again');
      }
    );
  }

  editUser(userId: number) {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '700px',
      data: {
        actionType: 'EDIT',
        userId: userId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveUser(result);
      }
    });
  }

  deleteUser(userId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete the selected User?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteUser(userId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('User deleted successfully');
            this.refreshData$.next(true);
          },
          () => {
            this.notificationService.openErrorSnackBar('User couldnot be delete, try again');
          }
        );
      }
    });
  }
}
