import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@app/@core';
import { CourtHearing } from '@app/case/models/court-hearing';
import { CaseService } from '@app/case/services/case.service';
import * as moment from 'moment';

@Component({
  selector: 'app-hearing-dialog',
  templateUrl: './hearing-dialog.component.html',
  styleUrls: ['./hearing-dialog.component.scss'],
})
export class HearingDialogComponent implements OnInit {
  previousDate = new Date();
  courtHearingForm: FormGroup;
  defendentId: number;
  hearingStages: [];
  freezeHearingStage: boolean = false;

  displayedColumns: string[] = ['hearingStage', 'hearingDate', 'subject', 'action'];
  dataSource = new MatTableDataSource();
  panelOpenState = false;
  hearingId: number = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<HearingDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initialiseForm();
    this.hearingStages = this.data.hearingStages;
    this.defendentId = this.data.defendantId;
    this.getDefendentHearing();
  }

  initialiseForm() {
    this.courtHearingForm = this.fb.group({
      hearingStage: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
      hearingDate: new FormControl('', Validators.required),
    });
  }

  resetForm() {
    this.courtHearingForm.reset();
  }

  submitHearing() {
    const courtHearing = new CourtHearing();
    Object.assign(courtHearing, this.courtHearingForm.value);
    courtHearing.id = this.hearingId;
    courtHearing.defendantInformation = { id: this.defendentId };

    this.caseService.saveCourtHearing(courtHearing).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Court Hearing details has been successfully saved');
        this.getDefendentHearing();
        this.courtHearingForm.reset();
      },
      () => {
        this.notificationService.openErrorSnackBar('Court Hearing details couldnot be saved, please try again');
      }
    );
    this.dialogRef.close();
  }

  getDefendentHearing() {
    this.caseService.getDefendentHearingDetails(this.defendentId).subscribe(
      (response) => {
        if (response.length > 0) {
          this.previousDate = response[0].hearingDate;
          this.dataSource.data = response;
        }
      },
      () => {
        this.notificationService.openErrorSnackBar('Court Hearing details couldnot be saved, please try again');
      }
    );
  }

  editHearing(elementId: number) {
    this.caseService.getCourtHearingById(elementId).subscribe(
      (response) => {
        this.hearingId = elementId;
        this.freezeHearingStage = true;
        this.courtHearingForm.patchValue({
          hearingStage: response.hearingStage,
          comment: response.comment,
          hearingDate: response.hearingDate,
        });
      },
      () => {
        this.notificationService.openErrorSnackBar('Court Hearing details couldnot be saved, please try again');
      }
    );
  }

  deleteDefendentHearing(deleteId: number) {
    this.caseService.deleteCourtHearing(deleteId).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Court Hearing details has been successfully deleted');
        this.getDefendentHearing();
      },
      () => {
        this.notificationService.openErrorSnackBar('Court Hearing details couldnot be delete, please try again');
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
