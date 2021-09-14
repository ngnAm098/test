import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { Credentials, CredentialsService } from '@app/auth';
import { Defendant } from '@app/case/models/defendant';
import { GeneralCorpus } from '@app/case/models/general-corpus';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { User } from '@app/case/models/user';
import { CaseService } from '@app/case/services/case.service';
import { split } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-general-corpus',
  templateUrl: './general-corpus.component.html',
  styleUrls: ['./general-corpus.component.scss'],
})
export class GeneralCorpusComponent implements OnInit {
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
  @Input() formKey: string;
  @Input() users: Observable<User[]>;
  @Input() generalCorpusMeetingDetails: GeneralCorpus[];
  @Input() defendants: Observable<Defendant[]>;
  @Input() investigationOfficerDetails: InvestigationOfficer;

  @Output() saveGeneralCorpusEmit: EventEmitter<GeneralCorpus> = new EventEmitter<GeneralCorpus>();
  @Output() updateGeneralCorpusEmit: EventEmitter<GeneralCorpus> = new EventEmitter<GeneralCorpus>();
  @Output() reviewCorpusMOMEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() editGeneralMeetingOutEmit: EventEmitter<number> = new EventEmitter<number>();

  caseScreeningForm: FormGroup;
  reviewCorpusForm: FormGroup;
  isCorpusRequired = false;
  credentials: Credentials;
  groupAssignees: any[] = [];
  groupAssigneesId: any[] = [];
  displayAssignee: any[] = [];
  corpusMemberList: any;
  getGeneralCorpusMeetingDetails: GeneralCorpus;

  constructor(
    private _formBuilder: FormBuilder,
    private credentialService: CredentialsService,
    private caseService: CaseService,
    public dialog: MatDialog
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.checkCorpusScreen();
    this.checkDropDown();
    this.getCorpusMember();
  }

  checkCorpusScreen() {
    this.caseScreeningForm = this._formBuilder.group({
      member: ['', Validators.required],
      briefFact: ['', Validators.required],
      issue: ['', Validators.required],
      recommendation: ['', Validators.required],
      remark: ['', Validators.required],
      presidedBy: ['', Validators.required],
      selectedGroupMember: [''],
    });
  }

  checkDropDown() {
    this.reviewCorpusForm = this._formBuilder.group({
      caseCategory: ['', Validators.required],
    });
  }

  public checkCaseScreenCtr = (controlName: string, errorName: string) => {
    return this.caseScreeningForm.controls[controlName].hasError(errorName);
  };

  showMOMForm: boolean = false;
  corpusMomId: number = null;
  openForm() {
    if (this.showMOMForm === true) {
      this.showMOMForm = false;
    } else {
      this.showMOMForm = true;
    }
    this.corpusMomId = null;
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
        const generalCorpus = new GeneralCorpus();
        Object.assign(generalCorpus, this.caseScreeningForm.value);
        generalCorpus.id = this.corpusMomId;
        generalCorpus.member = this.caseScreeningForm.get('member').value.join(',');
        const taskVariables = [{ key: 'assigneeAttorneyGeneral', value: 14 }];
        generalCorpus.taskVariables = taskVariables;
        this.saveGeneralCorpusEmit.emit(generalCorpus);
      } else {
        const generalCorpus = new GeneralCorpus();
        Object.assign(generalCorpus, this.caseScreeningForm.value);
        generalCorpus.id = this.corpusMomId;
        generalCorpus.member = this.caseScreeningForm.get('member').value.join(',');
        this.updateGeneralCorpusEmit.emit(generalCorpus);
      }
    });
  }

  updateCaseScreen() {
    const generalCorpus = new GeneralCorpus();
    Object.assign(generalCorpus, this.caseScreeningForm.value);
    generalCorpus.id = this.corpusMomId;
    generalCorpus.member = this.groupAssignees.join(',');
    generalCorpus.memberUserId = this.groupAssigneesId.join(',');
    this.updateGeneralCorpusEmit.emit(generalCorpus);
  }

  reviewCorpusMOM() {
    const taskVariables = [{ key: 'agRecommendation', value: this.reviewCorpusForm.get('caseCategory').value }];
    this.reviewCorpusMOMEmit.emit(taskVariables);
  }

  isReadOnly: boolean;
  editGeneralCorpusMeetingDetails(generalCorpusId: number) {
    this.caseService.getGeneralMeetingDetails(generalCorpusId).subscribe((response) => {
      this.getGeneralCorpusMeetingDetails = response;
      if (response) {
        const attendedCorpus = response.member.split(',');
        this.caseScreeningForm.patchValue({
          presidedBy: response.presidedBy,
          briefFact: response.briefFact,
          issue: response.issue,
          member: attendedCorpus,
          recommendation: response.recommendation,
          remark: response.remark,
          selectedGroupMember: response.member,
        });
        this.showMOMForm = true;
        this.corpusMomId = generalCorpusId;
      }
    });
    if (this.formKey === 'AG-REVIEW-CORPUS-MOM') {
      this.isReadOnly = true;
    }
  }

  resetForm() {
    this.caseScreeningForm.reset();
  }

  getCorpusMember() {
    this.caseService.getAllCorpusMembers().subscribe((response) => {
      this.corpusMemberList = response;
    });
  }
}
