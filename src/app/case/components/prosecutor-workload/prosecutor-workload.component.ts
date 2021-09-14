import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Credentials, CredentialsService } from '@app/auth';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { Victim } from '@app/case/models/victim';
import { WorkLoadDetail } from '@app/case/models/workLoadDetail';
import { IncomingLetter } from '@app/front-desk/models/incoming-letter';
import { environment } from '@env/environment';
import { InvestigationOfficeComponent } from '../investigation-office/investigation-office.component';
import { MailComponent } from '../mail/mail.component';

@Component({
  selector: 'app-prosecutor-workload',
  templateUrl: './prosecutor-workload.component.html',
  styleUrls: ['./prosecutor-workload.component.scss'],
})
export class ProsecutorWorkloadComponent implements OnInit {
  @Output() saveWorkLoadDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitMoreEvidenceDetails: EventEmitter<any> = new EventEmitter<any>();
  @Input() caseDetails: ReferringAgency;
  @Input() investigationOfficerDetails: InvestigationOfficeComponent;
  @Input() incomingLetter: IncomingLetter;
  @Input() caseAssigneeDetails: any;

  @Input() formKey: string;

  dueProcessReview: string;
  examinationForm: FormGroup;
  dueProcessForm: FormGroup;
  returnReviewForm: FormGroup;
  agReturnReviewForm: FormGroup;
  assessEvidenceForm: FormGroup;
  moreEvidenceForm: FormGroup;
  panelOpenState = false;
  moreEvidence: boolean = false;
  credentials: Credentials;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private credentialService: CredentialsService) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges() {
    this.setWorkLoadDetails();
  }

  initializeForm() {
    this.examinationForm = this.fb.group({
      examinationFact: ['', Validators.required],
      examinationFactComment: ['', Validators.required],
    });
    this.dueProcessForm = this.fb.group({
      dueProcess: ['', Validators.required],
      dueProcessComment: ['', Validators.required],
      chiefCommentOnDueProcess: [''],
    });
    this.assessEvidenceForm = this.fb.group({
      assessEvidence: ['', Validators.required],
      assessEvidenceComment: ['', Validators.required],
      moreEvidence: ['', Validators.required],
    });
    this.returnReviewForm = this.fb.group({
      isApproved: ['', Validators.required],
      chiefCommentOnDueProcess: [''],
    });
    this.agReturnReviewForm = this.fb.group({
      isApproved: ['', Validators.required],
      comment: ['', Validators.required],
    });
    this.moreEvidenceForm = this.fb.group({
      returnCase: ['', Validators.required],
      attachLetter: [''],
      moreEvidenceComment: ['', Validators.required],
    });
  }

  checkDueProcess() {
    if (this.assessEvidenceForm.get('assessEvidence').value === 'N') {
      this.moreEvidence = true;
    } else {
      this.moreEvidence = false;
      this.assessEvidenceForm.controls.moreEvidence.clearValidators();
      this.assessEvidenceForm.controls.moreEvidence.updateValueAndValidity();
    }
  }

  reviewFacts: boolean;
  dueProcessFormShow: boolean;
  examineReview: boolean;

  setWorkLoadDetails() {
    if (this.formKey === 'REVIEW-FACTS') {
      this.reviewFacts = true;
      this.dueProcessFormShow = false;
      this.examineReview = false;
    } else if (this.formKey === 'DUE-PROCESS') {
      this.reviewFacts = true;
      this.dueProcessFormShow = true;
      this.examineReview = false;
    } else if (
      this.formKey === 'EXAMINE-EVIDENCE' ||
      this.formKey === 'Waiting for more Evidence' ||
      this.formKey === 'CHIEF-REVIEW-CASE-RETURN'
    ) {
      this.reviewFacts = true;
      this.dueProcessFormShow = true;
      this.examineReview = true;
    }

    if (this.caseDetails) {
      if (this.caseDetails.examineFact !== null) {
        if (Number(this.caseDetails.examineFact) === 1) {
          this.examinationForm.patchValue({
            examinationFact: 'Y',
            examinationFactComment: this.caseDetails.examinationFactComment,
          });
        } else {
          this.examinationForm.patchValue({
            examinationFact: 'N',
            examinationFactComment: this.caseDetails.examinationFactComment,
          });
        }
      }

      if (this.caseDetails.dueProcess !== null) {
        if (Number(this.caseDetails.dueProcess) === 1) {
          this.dueProcessForm.patchValue({
            dueProcess: 'Y',
            dueProcessComment: this.caseDetails.dueProcessComment,
          });
        } else if (Number(this.caseDetails.dueProcess) === 0) {
          this.dueProcessForm.patchValue({
            dueProcess: 'N',
            dueProcessComment: this.caseDetails.dueProcessComment,
          });
        }
      }

      if (this.caseDetails.accessEvidence !== null) {
        if (Number(this.caseDetails.accessEvidence) === 1) {
          this.assessEvidenceForm.patchValue({
            assessEvidence: 'Y',
            assessEvidenceComment: this.caseDetails.assessEvidenceComment,
          });
        } else if (Number(this.caseDetails.accessEvidence) === 0) {
          this.assessEvidenceForm.patchValue({
            assessEvidence: 'N',
            assessEvidenceComment: this.caseDetails.assessEvidenceComment,
          });
          this.checkDueProcess();
        }
      }
    }
  }

  @Output() uploadFile: EventEmitter<any> = new EventEmitter<any>();
  checkMoreEvidence: boolean = true;
  selectFile(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  completeExaminationTask() {
    const workload = new WorkLoadDetail();
    workload.examinationFactComment = this.examinationForm.get('examinationFactComment').value;
    workload.decisionKey = environment.examinFact;

    if (this.examinationForm.get('examinationFact').value === 'Y') {
      workload.examineFact = 1;
      workload.decision = true;
      const taskVariables = [
        { key: workload.decisionKey, value: workload.decision },
        { key: 'assigneeProsecutor', value: this.credentials.userid },
      ];
      workload.taskVariables = taskVariables;
    } else {
      workload.examineFact = 0;
      workload.decision = false;
      const taskVariables = [
        { key: workload.decisionKey, value: workload.decision },
        { key: 'assigneeAttorneyGeneral', value: 14 },
      ];
      workload.taskVariables = taskVariables;
    }
    this.saveWorkLoadDetails.emit(workload);
  }

  completeDueProcessTask() {
    const workload = new WorkLoadDetail();
    workload.dueProcessComment = this.dueProcessForm.get('dueProcessComment').value;
    workload.decisionKey = environment.dueProcess;

    if (this.dueProcessForm.get('dueProcess').value === 'Y') {
      workload.decision = true;
      workload.dueProcess = 1;
      const taskVariables = [
        { key: workload.decisionKey, value: workload.decision },
        { key: 'assigneeProsecutor', value: this.credentials.userid },
      ];
      workload.taskVariables = taskVariables;
    } else {
      workload.decision = false;
      workload.dueProcess = 0;
      const taskVariables = [{ key: workload.decisionKey, value: workload.decision }];
      workload.taskVariables = taskVariables;
    }
    this.saveWorkLoadDetails.emit(workload);
  }

  fileToUpload: File = null;
  taskVariables: any[] = [];
  completeAssessTask() {
    const workload = new WorkLoadDetail();
    workload.assessEvidenceComment = this.assessEvidenceForm.get('assessEvidenceComment').value;
    if (this.assessEvidenceForm.get('assessEvidence').value === 'Y') {
      this.taskVariables = [{ key: 'examineOption', value: 'hasSubstantialEvidence' }];
      workload.accessEvidence = 1;
    } else {
      if (this.assessEvidenceForm.get('moreEvidence').value != 'returnCase') {
        //more evidence
        this.taskVariables = [{ key: 'examineOption', value: 'moreEvidence' }];
        workload.accessEvidence = 0;
        this.sendMail();
      } else {
        //case return
        this.taskVariables = [{ key: 'examineOption', value: 'caseReturn' }];
        workload.accessEvidence = 0;
      }
    }
    workload.taskVariables = this.taskVariables;
    this.saveWorkLoadDetails.emit(workload);
  }

  addMoreEvidence() {
    const workload = new WorkLoadDetail();
    workload.moreEvidenceComment = this.moreEvidenceForm.get('moreEvidenceComment').value;

    if (this.fileToUpload !== null) {
      workload.file = this.fileToUpload;
    }

    if (this.moreEvidenceForm.get('returnCase').value === 'N') {
      this.taskVariables = [{ key: 'moreEvidence', value: true }];
      workload.accessEvidence = 1;
    } else {
      this.taskVariables = [{ key: 'moreEvidence', value: false }];
      workload.accessEvidence = 0;
    }
    workload.taskVariables = this.taskVariables;
    this.submitMoreEvidenceDetails.emit(workload);
  }

  sendMail() {
    const dialogRef = this.dialog.open(MailComponent, {
      width: '900px',
      data: {
        caseDetails: this.caseDetails,
        prosecutorDetail: this.caseAssigneeDetails,
        investigationOfficerDetail: this.investigationOfficerDetails,
        incomingLetter: this.incomingLetter,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  caseReview(stringType: string) {
    var approved: boolean;
    const workload = new WorkLoadDetail();
    if (stringType === 'chief') {
      workload.chiefCommentOnDueProcess = this.returnReviewForm.get('chiefCommentOnDueProcess').value;
      if (this.returnReviewForm.get('isApproved').value === 'Y') {
        approved = true;
      } else {
        approved = false;
      }
      const taskVariables = [{ key: 'isApproved', value: approved }];
      workload.taskVariables = taskVariables;
      this.saveWorkLoadDetails.emit(workload);
    } else if (stringType === 'agExamineFacts') {
      if (this.agReturnReviewForm.get('isApproved').value === 'Y') {
        approved = true;
        const taskVariables = [{ key: 'reviewFactsNotApprovedForReturn', value: approved }];
        workload.taskVariables = taskVariables;
      } else {
        approved = false;
        const taskVariables = [{ key: 'reviewFactsNotApprovedForReturn', value: approved }];
        workload.taskVariables = taskVariables;
      }
      workload.agComment = this.agReturnReviewForm.get('comment').value;
      this.saveWorkLoadDetails.emit(workload);
    } else if (stringType === 'agExamineEvidence') {
      if (this.agReturnReviewForm.get('isApproved').value === 'Y') {
        approved = true;
        const taskVariables = [{ key: 'examinEvidenceCaseReturnNotApproved', value: approved }];
        workload.taskVariables = taskVariables;
      } else {
        approved = false;
        const taskVariables = [{ key: 'examinEvidenceCaseReturnNotApproved', value: approved }];
        workload.taskVariables = taskVariables;
      }

      workload.agCommentOnEvidence = this.agReturnReviewForm.get('comment').value;
      this.saveWorkLoadDetails.emit(workload);
    } else {
      return;
    }
  }
}
