import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CaseService } from '@app/case/services/case.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-judgement-dialog',
  templateUrl: './judgement-dialog.component.html',
  styleUrls: ['./judgement-dialog.component.scss'],
})
export class JudgementDialogComponent implements OnInit {
  judgementForm: FormGroup;
  formKey: string;
  message: string;
  decisionKey: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<JudgementDialogComponent>,
    private route: ActivatedRoute,
    private caseService: CaseService,
    private notificationService: NotificationService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkFormKey();
  }

  checkFormKey() {
    this.formKey = this.data.formKey;
    if (this.formKey === 'AG-REVIEW-CASE-OUTCOME') {
      this.message = 'Appeal case?';
      this.decisionKey = environment.appeal;
    } else if (this.formKey === 'CHIEF-REVIEW-CASE-OUTCOME') {
      this.message = 'Send to Attorney General for review?';
      this.decisionKey = environment.corpus;
    } else if (this.formKey === 'RECEIVE-JUDGMENT') {
      this.message = 'Send for Judgement Appraisal?';
      this.decisionKey = environment.subcorpus;
    }
  }

  initializeForm() {
    this.judgementForm = this.fb.group({
      subCorpus: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  subcorpus: boolean;
  submitJudgement() {
    if (this.judgementForm.get('subCorpus').value === 'Y') {
      this.subcorpus = true;
    } else {
      this.subcorpus = false;
    }

    const taskVariables = [{ key: this.decisionKey, value: this.subcorpus }];
    this.caseService.completeTask(taskVariables, this.data.taskInstanceId).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Judgement successfully submitted');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Judgement could not submitt,please try again later');
      }
    );

    this.dialogRef.close(true);
  }
}
