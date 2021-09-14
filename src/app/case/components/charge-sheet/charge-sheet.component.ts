import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargeSheetRequest } from '@app/case/models/charge-sheet-request';
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

@Component({
  selector: 'app-charge-sheet',
  templateUrl: './charge-sheet.component.html',
  styleUrls: ['./charge-sheet.component.scss'],
})
export class ChargeSheetComponent implements OnInit {
  @Input() taskInstanceId: string;
  @Input() formKey: string;
  @Input() caseDetails: ReferringAgency;
  @Input() defendants: Defendant[];
  @Input() getCaseBrief: CaseBrief;
  @Input() getChargeSheetDetails: ChargeSheetRequest;

  @Output() saveCaseChargeSheet: EventEmitter<ChargeSheetRequest> = new EventEmitter<ChargeSheetRequest>();
  @Output() uploadChargeSheetFile: EventEmitter<any> = new EventEmitter<any>();

  chargeSheetForm: FormGroup;
  choosenForm: string = 'Criminal';
  hideFormField: string = 'criminal';
  langauge: string = 'English';
  showChargeSheetUploadButton: boolean;
  fileToUpload: File = null;
  showSubmitButton: boolean;
  chargeSheetId: number;

  constructor(private formBuilder: FormBuilder, private credentialService: CredentialsService) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.createForm();
    this.setChargeSheetData();
  }

  setChargeSheetData() {
    let caseDefendants;
    if (this.caseDetails) {
      if (this.getCaseBrief) {
        if (this.defendants) {
          for (var i = 0; i < this.defendants.length; i++) {
            if (i === 0) {
              caseDefendants = this.defendants[i].defendantName;
            } else {
              caseDefendants = this.defendants[i].defendantName + ',' + caseDefendants;
            }
          }
          this.chargeSheetForm.patchValue({
            defendent: caseDefendants,
            offence: this.caseDetails.offence,
            caseName: this.caseDetails.caseName,
            jurisdiction: this.caseDetails.jurisdiction.jurisdictionName,
            factsOfCase: this.getCaseBrief.fact,
            prosecutor: this.credentialService.credentials.employeename,
          });
        }
      }
    }

    if (this.getChargeSheetDetails) {
      this.chargeSheetId = this.getChargeSheetDetails.id;
      this.chargeSheetForm.patchValue({
        salutation: this.getChargeSheetDetails.salutation,
        restitution: this.getChargeSheetDetails.restitution,
        propertyAttachment: this.getChargeSheetDetails.propertyAttachment,
        prayers: this.getChargeSheetDetails.prayers,
        addressedTo: this.getChargeSheetDetails.addressedTo,
        court: this.getChargeSheetDetails.court,
        charges: this.getChargeSheetDetails.charges,
      });
    }
  }

  createForm() {
    this.chargeSheetForm = this.formBuilder.group({
      offence: ['', Validators.required],
      caseName: ['', Validators.required],
      defendent: ['', Validators.required],
      salutation: ['', Validators.required],
      jurisdiction: ['', Validators.required],
      factsOfCase: ['', Validators.required],
      restitution: [''],
      propertyAttachment: [''],
      prayers: ['', Validators.required],
      addressedTo: ['', Validators.required],
      court: ['', Validators.required],
      charges: ['', Validators.required],
      prosecutor: ['', Validators.required],
    });
  }

  uploadDocument(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadDocumentConfirm() {
    this.uploadChargeSheetFile.emit(this.fileToUpload);
    this.showSubmitButton = true;
  }

  resetChargeSheetForm() {
    this.chargeSheetForm.reset();
  }

  saveChargeSheet() {
    if (this.chargeSheetForm.valid) {
      const chargeSheetRequest = new ChargeSheetRequest();
      Object.assign(chargeSheetRequest, this.chargeSheetForm.value);
      chargeSheetRequest.id = this.chargeSheetId;
      chargeSheetRequest.createdOn = new Date();
      chargeSheetRequest.updatedOn = new Date();
      const taskVariables = [
        {
          key: 'status',
          value: 'CHARGE-SHEET-PREPARED',
        },
      ];
      chargeSheetRequest.taskVariables = taskVariables;
      this.saveCaseChargeSheet.emit(chargeSheetRequest);
    } else {
      return;
    }
  }

  public validateForm = (controlName: string, errorName: string) => {
    return this.chargeSheetForm.controls[controlName].hasError(errorName);
  };

  generateChargeSheet() {
    var tempaltePath: string;
    var caseName = this.chargeSheetForm.get('caseName').value;
    var defendantName = this.chargeSheetForm.get('defendent').value;
    var salutation = this.chargeSheetForm.get('salutation').value;
    var jurisdiction = this.chargeSheetForm.get('jurisdiction').value;
    var factsOfCase = this.chargeSheetForm.get('factsOfCase').value;
    var prayers = this.chargeSheetForm.get('prayers').value;
    var prosecutor = this.chargeSheetForm.get('prosecutor').value;
    var addressedTo = this.chargeSheetForm.get('addressedTo').value;

    if (this.choosenForm === 'Criminal') {
      var charges = this.chargeSheetForm.get('charges').value;
      var offence = this.chargeSheetForm.get('offence').value;

      if (this.langauge === 'Dzongkhag') {
        var court = this.chargeSheetForm.get('court').value;
        tempaltePath = environment.templateURL + 'chargesheetDzongkha.docx';
      } else {
        tempaltePath = environment.templateURL + 'criminalChargeSheetEnglish.docx';
      }
    } else {
      var restitution = this.chargeSheetForm.get('restitution');
      var propertyAttachment = this.chargeSheetForm.get('propertyAttachment');

      if (this.langauge === 'Dzongkhag') {
        var court = this.chargeSheetForm.get('court').value;
        tempaltePath = environment.templateURL + 'chargesheetDzongkha.docx';
      } else {
        tempaltePath = environment.templateURL + 'civilChargeSheetEnglish.docx';
      }
    }

    loadFile(tempaltePath, function (error: any, content: any) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        caseName,
        defendantName,
        offence,
        salutation,
        jurisdiction,
        factsOfCase,
        charges,
        prayers,
        prosecutor,
        restitution,
        propertyAttachment,
        addressedTo,
        court,
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
      saveAs(out, 'chargesheet' + caseName + '.docx');
    });

    this.showChargeSheetUploadButton = true;
  }

  changeFormFeild() {
    if (this.choosenForm === 'Criminal') {
      this.choosenForm = 'Civil';
      this.hideFormField = 'civil';
      this.chargeSheetForm.controls.restitution.setValidators(Validators.required);
      this.chargeSheetForm.controls.propertyAttachment.setValidators(Validators.required);
      this.chargeSheetForm.controls.restitution.updateValueAndValidity();
      this.chargeSheetForm.controls.propertyAttachment.updateValueAndValidity();
    } else {
      this.choosenForm = 'Criminal';
      this.hideFormField = 'criminal';
      this.chargeSheetForm.controls.restitution.clearValidators();
      this.chargeSheetForm.controls.propertyAttachment.clearValidators();
      this.chargeSheetForm.controls.restitution.updateValueAndValidity();
      this.chargeSheetForm.controls.propertyAttachment.updateValueAndValidity();
    }
  }

  changeLangauge() {
    if (this.langauge === 'English') {
      this.langauge = 'Dzongkhag';
      this.chargeSheetForm.reset();
    } else {
      this.langauge = 'English';
      this.setChargeSheetData();
    }
  }
}

function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}
