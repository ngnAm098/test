import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// @ts-ignore
import PizZipUtils from 'pizzip/utils/index.js';
import { environment } from '@env/environment';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { Defendant } from '@app/case/models/defendant';
import { CaseBrief } from '@app/case/models/case-brief';
import { CredentialsService } from '@app/auth';
import { ChargeSheetRequest } from '@app/case/models/charge-sheet-request';
import { CaseService } from '@app/case/services/case.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-case',
  templateUrl: './file-case.component.html',
  styleUrls: ['./file-case.component.scss'],
})
export class FileCaseComponent implements OnInit {
  @Input() caseDetails: ReferringAgency;
  @Input() defendants: Defendant[];
  @Input() getCaseBrief: CaseBrief;
  @Input() getChargeSheetDetails: ChargeSheetRequest;

  @Output() uploadPOAFile: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitPowerOfAttorney: EventEmitter<any> = new EventEmitter<any>();
  @Output() downloadFile: EventEmitter<Object> = new EventEmitter<Object>();

  submitButton: boolean = true;
  powerOfAttorneyForm: FormGroup;
  fileToUpload: File = null;
  upload_loading: boolean = false;
  showPOAUpload: boolean;
  choesenForm: string = 'Power of Attorney';
  showChargeSheetForm: boolean;
  showPOAForm: boolean = true;
  caseId: number;
  caseAttachment: any;
  downloadPOA: boolean = false;

  constructor(
    private fb: FormBuilder,
    private credentialService: CredentialsService,
    private caseService: CaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.caseId = params.caseId;
    });
    this.initialiseForm();
    this.getCasePOA();
  }

  initialiseForm() {
    this.powerOfAttorneyForm = this.fb.group({
      addressedTo: ['', Validators.required],
      courtAddress: ['', Validators.required],
      defendantName: ['', Validators.required],
      Offence: ['', Validators.required],
      caseNumber: ['', Validators.required],
      prosecutor: this.credentialService.credentials.employeename,
      chiefName: ['', Validators.required],
      currentDate: ['', Validators.required],
      employeeId: this.credentialService.credentials.employeeid,
    });
  }

  getCasePOA() {
    this.caseService.getPoaAttachment('POA', this.caseId).subscribe((res) => {
      if (res.length > 0) {
        this.caseAttachment = res;
        this.downloadPOA = true;
        this.showPOAUpload = true;
      }
    });
  }

  downloadAttachedFile(attachmentId: number, documentName: string) {
    const attachment = [{ attachmentId: attachmentId, documentName: documentName }];
    this.downloadFile.emit(attachment);
  }

  resetForm() {
    this.powerOfAttorneyForm.reset();
  }

  changeForm() {
    if (this.choesenForm === 'Power of Attorney') {
      this.choesenForm = 'Re-Generate Charge Sheet';
      this.showChargeSheetForm = true;
      this.showPOAForm = false;
      this.showPOAUpload = false;
    } else {
      this.choesenForm = 'Power of Attorney';
      this.showChargeSheetForm = false;
      this.showPOAForm = true;
    }
  }

  uploadDocument(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDocumentConfirm() {
    this.uploadPOAFile.emit(this.fileToUpload);
    this.submitButton = false;
  }

  savePowerOfAttorney() {
    this.submitPowerOfAttorney.emit();
  }

  generatePOA() {
    var cDate = this.powerOfAttorneyForm.get('currentDate').value;
    var addressed_to = this.powerOfAttorneyForm.get('addressedTo').value;
    var court = this.powerOfAttorneyForm.get('courtAddress').value;
    var rsn = this.powerOfAttorneyForm.get('Offence').value;
    var defendant = this.powerOfAttorneyForm.get('defendantName').value;
    var emp_id = this.powerOfAttorneyForm.get('employeeId').value;
    var prosecutor_name = this.powerOfAttorneyForm.get('prosecutor').value;
    var case_number = this.powerOfAttorneyForm.get('caseNumber').value;
    var chief_name = this.powerOfAttorneyForm.get('chiefName').value;

    loadFile(environment.templateURL + 'POA.docx', function (error: any, content: any) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        currentDate: cDate,
        addressedTo: addressed_to,
        courtAddress: court,
        Offence: rsn,
        defendantName: defendant,
        employeeId: emp_id,
        prosecutor: prosecutor_name,
        caseNumber: case_number,
        chiefName: chief_name,
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
      saveAs(out, 'powerOfAttorney' + case_number + '.docx');
    });
    this.showPOAUpload = true;
  }
}

function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}
