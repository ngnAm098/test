import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { Employee } from '@app/master/models/employee';
import { Role } from '@app/master/models/role';
import { User } from '@app/master/models/user';
import { MasterService } from '@app/master/services/master.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  userId: number;
  actionType: string;
  roles: Role[];
  employees: Employee[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MasterService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.actionType = this.data.actionType;

    this.initializeForm();
    this.populateMasterData();
  }
  initializeForm() {
    this.userForm = this.fb.group({
      employeeId: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    if (this.actionType === 'EDIT') {
      this.service.loadUser(this.userId).subscribe(
        (response) => {
          this.userForm.patchValue({
            employeeId: response.employeeId,
            roleId: response.roleId,
            username: response.username,
            // password: response.password,
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Couldnot load User details, please try again later');
        }
      );
    }
  }

  populateMasterData() {
    this.service.loadRoleList().subscribe((response) => {
      this.roles = response;
    });

    this.service.loadEmployeeList().subscribe((response) => {
      this.employees = response;
    });
  }
  saveUser() {
    if (this.userForm.valid) {
      const user = new User();
      Object.assign(user, this.userForm.value);
      this.dialogRef.close(user);
    } else {
      return;
    }
  }
  updateUser() {
    if (this.userForm.valid) {
      const user = new User();
      Object.assign(user, this.userForm.value);
      user.id = this.userId;
      this.dialogRef.close(user);
    } else {
      return;
    }
  }
  resetForm() {
    this.userForm.reset();
    this.userForm = null;
  }

  onClose() {
    this.dialogRef.close();
  }
}
