import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { Department } from '@app/master/models/department';
import { Division } from '@app/master/models/division';
import { DivisionUnit } from '@app/master/models/divisionUnit';
import { Employee } from '@app/master/models/employee';
import { Organization } from '@app/master/models/organization';
import { MasterService } from '@app/master/services/master.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  employeeId: number;
  actionType: string;
  organizations: Organization[];
  departments: Department[];
  divisions: Division[];
  divisionUnits: DivisionUnit[];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: MasterService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private credentialsService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.employeeId = this.data.employeeId;
    this.actionType = this.data.actionType;

    this.initializeForm();
    this.populateMasterData();
  }

  initializeForm() {
    this.employeeForm = this.fb.group({
      employeeName: new FormControl('', Validators.required),
      employeeNumber: new FormControl('', Validators.required),
      organizationId: new FormControl('', Validators.required),
      cid: new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
      divisionId: new FormControl('', Validators.required),
      divisionUnitId: new FormControl('', Validators.required),
    });

    if (this.actionType === 'EDIT') {
      this.service.loadEmployee(this.employeeId).subscribe(
        (response) => {
          this.getDivisions(response.departmentId);
          this.getDivisionUnits(response.divisionUnit.divisionId);
          this.employeeForm.patchValue({
            employeeName: response.employeeName,
            employeeNumber: response.employeeNumber,
            organizationId: response.organizationId,
            cid: response.cid,
            departmentId: response.departmentId,
            divisionId: response.divisionUnit.division.id,
            divisionUnitId: response.divisionUnitId,
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Couldnot load employee details, please try again later');
        }
      );
    }
  }
  populateMasterData() {
    this.service.loadAgencyList().subscribe((response) => {
      this.organizations = response;
    });

    this.service.loadDepartmentList().subscribe((response) => {
      this.departments = response;
    });
  }

  getDivisions(departmentId: number) {
    this.service.loadDivisionList(departmentId).subscribe((response) => {
      this.divisions = response;
    });
  }
  getDivisionUnits(divisionId: number) {
    this.service.loadDivisionUnitList(divisionId).subscribe((response) => {
      this.divisionUnits = response;
    });
  }

  saveEmployee() {
    if (this.employeeForm.valid) {
      const employee = new Employee();
      Object.assign(employee, this.employeeForm.value);
      this.dialogRef.close(employee);
    } else {
      return;
    }
  }

  updateEmployee() {
    if (this.employeeForm.valid) {
      const employee = new Employee();
      Object.assign(employee, this.employeeForm.value);
      employee.id = this.employeeId;
      this.dialogRef.close(employee);
    } else {
      return;
    }
  }

  resetForm() {
    this.employeeForm.reset();
    this.employeeForm = null;
  }

  onClose() {
    this.dialogRef.close();
  }
}
