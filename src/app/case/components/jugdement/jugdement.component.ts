import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials, CredentialsService } from '@app/auth';
import { Dzongkhag } from '@app/case/models/dzongkhag';
import { JudgementModel } from '@app/case/models/judgement';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { saveAs } from 'file-saver';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// @ts-ignore
import PizZipUtils from 'pizzip/utils/index.js';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CaseService } from '@app/case/services/case.service';
import { MatDialog } from '@angular/material/dialog';
import { JudgementDialogComponent } from './judgement-dialog/judgement-dialog.component';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jugdement',
  templateUrl: './jugdement.component.html',
  styleUrls: ['./jugdement.component.scss'],
  providers: [DatePipe],
})
export class JugdementComponent implements OnInit {
  @Input() dzongkhags: Observable<Dzongkhag[]>;
  judgement: JudgementModel;
  @Input() formKey: string;
  @Input() taskInstanceId: string;

  @Output() saveCaseJudgement: EventEmitter<JudgementModel> = new EventEmitter<JudgementModel>();
  @Output() downloadFile: EventEmitter<Object> = new EventEmitter<Object>();
  @Output() caseReview: EventEmitter<any> = new EventEmitter<any>();
  @Output() agCaseReview: EventEmitter<any> = new EventEmitter<any>();
  @Output() uploadFile: EventEmitter<any> = new EventEmitter<any>();

  displayedColumns = [
    'defendantCid',
    'defendantName',
    'judgementNo',
    'judgementDate',
    'lastAppealDate',
    'updatedOn',
    'updateJudgement',
  ];
  dataSource = new MatTableDataSource();

  defendantList: any;
  judgementForm: FormGroup;
  fileToUpload: File = null;
  credentials: Credentials;
  subcorpus: boolean;
  showJudgementForm: boolean;
  showReviewJudgement: boolean;
  caseDetails: ReferringAgency;
  showSubmitJudgement: boolean = false;
  picker1: Date;
  showCloseJudgement: boolean = false;
  maxDate = new Date();
  incomingLetterId: number;
  caseId: number;
  caseAttachment: any;
  appeal: string;
  showOtherGround: boolean = false;
  defendantId: number;
  downloadJudgement: boolean = false;
  cardTitle: string;

  constructor(
    private fb: FormBuilder,
    private credentialService: CredentialsService,
    private datepipe: DatePipe,
    private caseService: CaseService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.incomingLetterId = params.incomingLetterId;
      this.caseId = params.caseId;
    });
    this.initializeForm();
    this.checkAllDefendentJudgement();
    this.setCaseDetails();
  }

  initializeForm() {
    if (this.formKey === 'RECEIVE-JUDGMENT') {
      this.cardTitle = 'Prepare Judgment Report';
    } else {
      this.cardTitle = 'Review Case Judgment Report';
    }

    this.judgementForm = this.fb.group({
      agency: ['', Validators.required],
      dzongkhag: ['', Validators.required],
      addressedTo: ['', Validators.required],
      subject: ['', Validators.required],
      court: ['', Validators.required],
      body: ['', Validators.required],
      judgementNo: ['', Validators.required],
      judgementDate: ['', Validators.required],
      judgementRemark: ['', Validators.required],
      caseOutCome: ['', Validators.required],
      appealDate: ['', Validators.required],
      charges: ['', Validators.required],
      defendantName: ['', Validators.required],
      sentencingRange: ['', Validators.required],
      otherGrounds: [''],
    });
  }

  setCaseDetails() {
    this.caseService.loadCaseDetails(this.incomingLetterId).subscribe((response) => {
      this.caseDetails = response;
      this.judgementForm.patchValue({
        addressedTo: this.caseDetails.chargeSheet.addressedTo,
        agency: this.caseDetails.referringAgency.agencyName,
        court: this.caseDetails.chargeSheet.court,
        charges: this.caseDetails.chargeSheet.charges,
        appealDate: new Date(moment().add(10, 'days').calendar()),
      });
    });
  }

  uploadDocument(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  saveJudgement() {
    const caseJudgement = new JudgementModel();
    Object.assign(caseJudgement, this.judgementForm.value);
    caseJudgement.defendantInformation = { id: this.defendantId };
    caseJudgement.fileToUpload = this.fileToUpload;
    if (this.judgement !== null) {
      caseJudgement.id = this.judgement.id;
    }
    this.saveCaseJudgement.emit(caseJudgement);
  }

  downloadCaseJudgment(attachmentId: number, documentName: string) {
    const attachment = [{ attachmentId: attachmentId, documentName: documentName }];
    this.downloadFile.emit(attachment);
  }

  sendCaseToAG: string;

  caseReviewByChief() {
    let taskVariables;
    if (this.sendCaseToAG === 'Y') {
      this.subcorpus = true;
      taskVariables = [
        { key: environment.corpus, value: this.subcorpus },
        { key: 'assigneeAttorneyGeneral', value: 14 },
      ];
    } else {
      this.subcorpus = false;
      taskVariables = [{ key: environment.corpus, value: this.subcorpus }];
    }
    this.caseReview.emit(taskVariables);
  }

  generateJudgementReport() {
    var address_to = this.judgementForm.get('addressedTo').value;
    var agency_name = this.judgementForm.get('agency').value;
    var dzongkhag_name = this.judgementForm.get('dzongkhag').value;
    var subject_of_Form = this.judgementForm.get('subject').value;
    var body_of_form = this.judgementForm.get('body').value;
    var court_name = this.judgementForm.get('court').value;
    var jud_number_date =
      this.judgementForm.get('judgementNo').value +
      ' ' +
      this.datepipe.transform(this.judgementForm.get('judgementDate').value, 'dd/MM/yyyy');
    var appeal_date = this.datepipe.transform(this.judgementForm.get('appealDate').value, 'dd-MM-yyyy');
    var defendant = this.judgementForm.get('defendantName').value;
    var charge = this.judgementForm.get('charges').value;
    var case_out_come = this.judgementForm.get('caseOutCome').value;
    var prosecutor_name = this.credentials.employeename;
    var remark = this.judgementForm.get('judgementRemark').value;
    var currentDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy');

    loadFile(environment.templateURL + 'judgementReport.docx', function (error: any, content: any) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        addressedTo: address_to,
        agency: agency_name,
        dzongkhag: dzongkhag_name,
        subject: subject_of_Form,
        body: body_of_form,
        court: court_name,
        judgementNoDate: jud_number_date,
        appealDate: appeal_date,
        defendantName: defendant,
        charges: charge,
        caseOutcome: case_out_come,
        remarks: remark,
        prosecutor: prosecutor_name,
        currentDate,
      });
      try {
        doc.render();
      } catch (error) {
        function replaceErrors(key: any, value: any) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function (error, key) {
              error[key] = value[key];
              return error;
            }, {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));
        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function (error: any) {
              return error.properties.explanation;
            })
            .join('\n');
          console.log('errorMessages', errorMessages);
        }
        throw error;
      }
      var out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      saveAs(out, 'Judgementreport' + defendant + '.docx');
    });
    this.showSubmitJudgement = true;
  }

  caseReviewByAG() {
    if (this.appeal === 'Y') {
      this.subcorpus = true;
    } else {
      this.subcorpus = false;
    }
    const taskVariables = [{ key: environment.appeal, value: this.subcorpus }];
    this.agCaseReview.emit(taskVariables);
  }

  updateDefendentJudgement(defendant_id: number, defendant_name: string) {
    this.judgementForm.reset();
    this.setCaseDetails();
    this.judgement = null;
    this.defendantId = null;
    this.showJudgementForm = true;
    this.caseService.getCaseJudgementByDefendent(defendant_id).subscribe((response) => {
      this.judgement = response;
      if (this.judgement.id !== null) {
        this.defendantId = defendant_id;
        this.caseAttachment = response.caseAttachment;
        this.judgementForm.patchValue({
          judgementNo: this.judgement.judgementNo,
          judgementDate: this.judgement.judgementDate,
          judgementRemark: this.judgement.judgementRemark,
          caseOutCome: this.judgement.caseOutCome,
          appealDate: this.judgement.appealDate,
          dzongkhag: this.judgement.dzongkhag,
          subject: this.judgement.subject,
          defendantName: defendant_name,
          body: this.judgement.body,
          sentencingRange: this.judgement.sentencingRange,
          otherGrounds: this.judgement.otherGrounds,
        });
        this.downloadJudgement = true;
        this.caseOutComeSelected(this.judgement.caseOutCome);
        if (this.formKey === 'RECEIVE-JUDGMENT') {
          this.showSubmitJudgement = true;
        }
      } else {
        this.defendantId = defendant_id;
        this.judgementForm.patchValue({
          defendantName: defendant_name,
        });
        this.showSubmitJudgement = false;
      }
    });
  }

  submitJudgement() {
    const dialogRef = this.dialog.open(JudgementDialogComponent, {
      width: '700px',
      data: {
        taskInstanceId: this.taskInstanceId,
        formKey: this.formKey,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  checkAllDefendentJudgement() {
    this.caseService.getAllDefendants(this.caseId).subscribe((response) => {
      this.defendantList = response;
      for (let i = 0; i < this.defendantList.length; i++) {
        if (this.defendantList[i].judgementDate !== null) {
          this.showCloseJudgement = true;
        } else {
          this.showCloseJudgement = false;
        }
      }
    });
  }

  caseOutComeSelected(selectedValue: string) {
    if (selectedValue === 'othegrounds') {
      this.showOtherGround = true;
    } else {
      this.showOtherGround = false;
    }
  }
}

function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}
