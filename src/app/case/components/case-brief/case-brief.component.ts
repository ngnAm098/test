import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials, CredentialsService } from '@app/auth';
import { CaseBrief } from '@app/case/models/case-brief';
import { Defendant } from '@app/case/models/defendant';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-case-brief',
  templateUrl: './case-brief.component.html',
  styleUrls: ['./case-brief.component.scss'],
})
export class CaseBriefComponent implements OnInit {
  @Input() formKey: string;
  @Input() caseDetails: ReferringAgency;
  @Input() defendants: Observable<Defendant[]>;
  @Input() investigationOfficerDetails: InvestigationOfficer;
  @Input() getCaseBrief: CaseBrief;

  @Output() saveCaseBriefDetails: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveCaseBriefDetailsAsDraft: EventEmitter<any> = new EventEmitter<any>();

  @Output() submitCorpusRequestEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitCorpusApproveEmit: EventEmitter<any> = new EventEmitter<any>();

  isApproved = false;
  casename: string;
  casenumber: string;
  caseBriefForm: FormGroup;
  credentials: Credentials;
  caseBriefId: number = null;
  showCaseCategory: boolean;
  showCommentBox: boolean;

  constructor(private _formBuilder: FormBuilder, private credentialsService: CredentialsService) {
    this.credentials = this.credentialsService.credentials;
  }

  ngOnInit(): void {
    this.initializeCaseBriefForm();
  }

  ngOnChanges() {
    this.setCaseBriefData();
  }

  initializeCaseBriefForm() {
    if (
      this.formKey === 'CASE-BRIEF' ||
      this.formKey === 'REVIEW-FACTS' ||
      this.formKey === 'DUE-PROCESS' ||
      this.formKey === 'EXAMINE-EVIDENCE'
    ) {
      this.caseBriefForm = this._formBuilder.group({
        facts: ['', Validators.required],
        issues: ['', Validators.required],
        ruleslaws: ['', Validators.required],
        application: ['', Validators.required],
        conclusion: ['', Validators.required],
      });
    } else {
      this.caseBriefForm = this._formBuilder.group({
        facts: ['', Validators.required],
        issues: ['', Validators.required],
        ruleslaws: ['', Validators.required],
        application: ['', Validators.required],
        conclusion: ['', Validators.required],
        caseCategory: ['', Validators.required],
        isApproved: ['', Validators.required],
        comment: ['', Validators.required],
      });
    }
  }

  caseBriefDetails(submitType: string) {
    const caseBriefModel = new CaseBrief();
    caseBriefModel.id = this.caseBriefId;
    caseBriefModel.issue = this.caseBriefForm.get('issues').value;
    caseBriefModel.fact = this.caseBriefForm.get('facts').value;
    caseBriefModel.rule = this.caseBriefForm.get('ruleslaws').value;
    caseBriefModel.conclusion = this.caseBriefForm.get('conclusion').value;
    caseBriefModel.application = this.caseBriefForm.get('application').value;
    caseBriefModel.updatedBy = this.credentials.userid;
    caseBriefModel.updatedByName = this.credentials.username;
    caseBriefModel.caseInformation = { id: this.caseDetails.id };

    if (submitType === 'draft') {
      this.saveCaseBriefDetailsAsDraft.emit(caseBriefModel);
    } else {
      let taskVariables: any;
      if (this.formKey === 'CASE-BRIEF') {
        taskVariables = [{ key: 'message', value: 'submit' }];
      } else if (this.formKey === 'CHIEF-REVIEW-CASE-BRIEF') {
        caseBriefModel.caseCategory = this.caseBriefForm.get('caseCategory').value;
        if (this.isApproved == true) {
          taskVariables = [
            { key: 'typeofcase', value: caseBriefModel.caseCategory },
            { key: 'isApproved', value: this.isApproved },
          ];
        } else {
          caseBriefModel.casebriefComment = this.caseBriefForm.get('comment').value;
          taskVariables = [
            { key: 'isApproved', value: this.isApproved },
            { key: 'assigneeProsecutor', value: 19 },
          ];
        }
      }
      caseBriefModel.taskVariables = taskVariables;
      this.saveCaseBriefDetails.emit(caseBriefModel);
    }
  }

  onCheckboxChange(selectedValue: string) {
    if (selectedValue === 'Y') {
      this.isApproved = true;
      this.showCaseCategory = true;
      this.showCommentBox = false;
    } else {
      this.isApproved = false;
      this.showCaseCategory = false;
      this.showCommentBox = true;
    }
    this.enableSubmit();
  }

  setCaseBriefData() {
    if (this.getCaseBrief) {
      this.caseBriefId = this.getCaseBrief.id;
      this.caseBriefForm.patchValue({
        facts: this.getCaseBrief.fact,
        issues: this.getCaseBrief.issue,
        ruleslaws: this.getCaseBrief.rule,
        application: this.getCaseBrief.application,
        conclusion: this.getCaseBrief.conclusion,
        caseCategory: this.getCaseBrief.caseCategory,
      });
    } else {
      return;
    }

    // this.caseBriefId = this.getCaseBrief?.id;
    // this.caseBriefForm.patchValue({
    //   facts: this.getCaseBrief?.fact,
    //   issues: this.getCaseBrief?.issue,
    //   ruleslaws: this.getCaseBrief?.rule,
    //   application: this.getCaseBrief?.application,
    //   conclusion: this.getCaseBrief?.conclusion,
    //   caseCategory: this.getCaseBrief?.caseCategory,
    // });
  }

  submitCorpusRequest(submitType: string) {
    if (submitType === 'request') {
      const taskVariables = [
        { key: 'isCorpusMeetingRequired', value: this.isApproved },
        //{ key: 'assignee', value: 17 }
      ];
      this.submitCorpusRequestEmit.emit(taskVariables);
    } else {
      const taskVariables = [
        { key: 'isapproved', value: this.isApproved },
        //{ key: 'assigneeProsecutor', value: 19 }
      ];

      this.submitCorpusApproveEmit.emit(taskVariables);
    }
  }

  chiefSubmit: boolean = true;
  enableSubmit() {
    if (this.caseDetails.referringAgency.agencyName === 'Anti-Corruption Commission') {
      this.caseBriefForm.patchValue({
        caseCategory: 'ACC',
      });
    }
    this.chiefSubmit = false;
  }
}
