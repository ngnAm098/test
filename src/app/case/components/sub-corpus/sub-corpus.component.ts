import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { Credentials, CredentialsService } from '@app/auth';
import { Defendant } from '@app/case/models/defendant';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { SubCorpus } from '@app/case/models/sub-corpus';
import { User } from '@app/case/models/user';
import { CaseService } from '@app/case/services/case.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sub-corpus',
  templateUrl: './sub-corpus.component.html',
  styleUrls: ['./sub-corpus.component.scss'],
})
export class SubCorpusComponent implements OnInit {
  displayedColumns: string[] = [
    'SlNo',
    'corpusPresidedBy',
    'facts',
    'corpusMembers',
    'issuesDiscussed',
    'corpusRecommendation',
    'remarksByAG',
    'edit',
  ];

  @Input() caseDetails: ReferringAgency;
  @Input() defendants: Defendant[];
  @Input() formKey: string;
  @Input() users: Observable<User[]>;
  @Input() subCorpusMeetingDetails: SubCorpus[];

  @Output() saveSubCorpusEmit: EventEmitter<SubCorpus> = new EventEmitter<SubCorpus>();
  @Output() editSubCorpusMeetingOutEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateSubCorpusMeetingEmit: EventEmitter<SubCorpus> = new EventEmitter<SubCorpus>();

  subCorpusForm: FormGroup;
  reviewCorpusForm: FormGroup;
  isCorpusRequired = false;
  credentials: Credentials;
  groupAssignees: any[] = [];
  groupAssigneesId: any[] = [];
  displayAssignee: any[] = [];
  corpusMemberList: any;
  appealButton: boolean = true;
  appeal: string;
  showAppraisalForm: boolean = false;
  subCorpusId: number = null;
  taskInstanceId: number;

  constructor(
    private _formBuilder: FormBuilder,
    private credentialService: CredentialsService,
    private caseService: CaseService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      this.taskInstanceId = param.taskInstanceId;
    });
    this.checkCorpusScreen();
    this.getCorpusMember();
  }

  getCorpusMember() {
    this.caseService.getAllCorpusMembers().subscribe((response) => {
      this.corpusMemberList = response;
    });
  }

  checkCorpusScreen() {
    this.subCorpusForm = this._formBuilder.group({
      member: ['', Validators.required],
      briefFact: ['', Validators.required],
      issue: ['', Validators.required],
      recommendation: ['', Validators.required],
      remark: ['', Validators.required],
      presidedBy: ['', Validators.required],
    });
  }

  openAppraisalForm() {
    if (this.showAppraisalForm === true) {
      this.showAppraisalForm = false;
    } else {
      this.showAppraisalForm = true;
    }
    this.subCorpusId = null;
  }

  public checkCaseScreenCtr = (controlName: string, errorName: string) => {
    return this.subCorpusForm.controls[controlName].hasError(errorName);
  };

  resetForm() {
    this.subCorpusForm.reset();
  }

  saveCaseScreen() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Message',
        message: 'Do you want to forward to Attorney General?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const subCorpus = new SubCorpus();
        Object.assign(subCorpus, this.subCorpusForm.value);
        subCorpus.id = this.subCorpusId;
        subCorpus.member = this.subCorpusForm.get('member').value.join(',');
        const taskVariables = [{ key: 'SUB-CORPUS-DONE', value: 'forwarding to AG' }];
        subCorpus.taskVariables = taskVariables;
        this.saveSubCorpusEmit.emit(subCorpus);
      } else {
        const subCorpus = new SubCorpus();
        Object.assign(subCorpus, this.subCorpusForm.value);
        subCorpus.id = this.subCorpusId;
        subCorpus.member = this.subCorpusForm.get('member').value.join(',');
        this.updateSubCorpusMeetingEmit.emit(subCorpus);
      }
    });
  }

  editSubCorpusMeetingDetails(id: number) {
    this.caseService.getMeetingDetailsBySubCorpusId(id).subscribe((response) => {
      if (response) {
        this.subCorpusId = response.id;
        const attendedCorpus = response.member.split(',');
        this.subCorpusForm.patchValue({
          presidedBy: response.presidedBy,
          briefFact: response.briefFact,
          member: attendedCorpus,
          issue: response.issue,
          recommendation: response.recommendation,
          remark: response.remark,
          selectedGroupMember: response.member,
        });
        this.showAppraisalForm = true;
      } else {
        return;
      }
    });
  }

  checkAppeal() {
    this.appealButton = false;
  }

  taskVariables: any;
  judgementReviewByAG() {
    let showDecision: string = null;
    if (this.appeal === 'Y') {
      this.taskVariables = [{ key: 'appealAfterSubCorpus', value: true }];
      showDecision = 'Yes';
    } else {
      showDecision = 'No';
      this.taskVariables = [{ key: 'appealAfterSubCorpus', value: false }];
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Do you want to Appeal: ' + showDecision,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.caseService.completeTask(this.taskVariables, this.taskInstanceId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Judgement successfully approved');
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.notificationService.openErrorSnackBar('Judgement could not be sent,please try again!');
          }
        );
      } else {
        dialogRef.close();
      }
    });
  }
}
