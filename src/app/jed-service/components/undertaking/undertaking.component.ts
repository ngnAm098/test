import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { environment } from '@env/environment';
// @ts-ignore
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CredentialsService } from '@app/auth';
import { NotificationService } from '@app/@core';
import { Undertaking } from '@app/front-desk/models/undertaking';

@Component({
  selector: 'app-undertaking',
  templateUrl: './undertaking.component.html',
  styleUrls: ['./undertaking.component.scss']
})
export class UndertakingComponent implements OnInit {

  caseInformationId: number;
  formKey: string;
  taskIntanceId: string;
  enforcementId: number;
  receiptNo: string;
  sequenceData: Sequence[];
  undertakingForm: FormGroup;
  enableSaveButton: boolean = true;
  maxDate = new Date();
  undertakingId: number;
  gewogs: any;
  villages: any;
  dzongkhags: any;

  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UndertakingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jedService: JedApiServiceService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getDzongkhag();
    if (this.data.action === 'EDIT') {
      this.getUndertakingById();
    } 
  }

  initializeForm() {
    this.undertakingForm = this.fb.group({
      defendantName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      cid: new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      defendantContactNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      defendantParentName: new FormControl('', Validators.required),
      villageId: new FormControl('', Validators.required),
      gewogId: new FormControl('', Validators.required),
      dzongkhagId: new FormControl('', Validators.required),
      occupation: new FormControl('', Validators.required),
      judgementNo: new FormControl('', Validators.required),
      judgementDate: new FormControl('', Validators.required),
      extensionDate: new FormControl('', Validators.required),
      witnessName: new FormControl('', Validators.required),
      witnessCid: new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      witnessContactNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      place: new FormControl('', Validators.required),
      attorney: new FormControl('', Validators.required),
      statement: new FormControl('', Validators.required),
    });
  } 

  getDzongkhag() {
    this.jedService.loadDzongkhagList().subscribe((response) => {
      this.dzongkhags = response;
    });
  }
  getGewogs(dzongkhagId: number) {
    this.jedService.loadGewogList(dzongkhagId).subscribe((response) => {
      this.gewogs = response;
    });
  }
  getVillages(gewogId: number) {
    this.jedService.loadVilageList(gewogId).subscribe((response) => {
      this.villages = response;
    });
  }

  getUndertakingById() {
    this.jedService.loadUndertakingById(this.data.undertakingId).subscribe((response) => {
      this.undertakingId = response.id;
      this.getGewogs(response.dzongkhag.id);
      this.getVillages(response.gewog.id); 
      this.undertakingForm.patchValue({
        defendantName: response.defendantName,
        gender: response.gender,
        dob: response.dob,
        cid: response.cid,
        defendantContactNo: response.defendantContactNo,
        defendantParentName: response.defendantParentName, 
        dzongkhagId: response.dzongkhag.id, 
        gewogId: response.gewog.id,
        villageId: response.village.id,
        occupation: response.occupation,
        judgementNo: response.judgementNo,
        judgementDate: response.judgementDate,
        extensionDate: response.extensionDate,
        witnessName: response.witnessName,
        witnessCid: response.witnessCid,
        witnessContactNo: response.witnessContactNo,
        place: response.place,
        attorney: response.attorney,
        statement: response.statement,
      });
    });
  }

  generateUndertaking() {
    let defendantName = this.undertakingForm.get('defendantName').value;
    let gender = this.undertakingForm.get('gender').value;
    let dob = this.undertakingForm.get('dob').value;
    let contactNo = this.undertakingForm.get('contactNo').value;
    let parentName = this.undertakingForm.get('defendantParentName').value;
    let judgementNo = this.undertakingForm.get('judgementNo').value;
    let defedantCid = this.undertakingForm.get('cid').value;
    let occupation = this.undertakingForm.get('occupation').value;
    let judgementDate = this.undertakingForm.get('judgementDate').value;
    let attorneyName = this.undertakingForm.get('attorneyName').value;
    let witnessName = this.undertakingForm.get('witnessName').value;
    let witnessCid = this.undertakingForm.get('witnessCid').value;
    let witnessContactNo = this.undertakingForm.get('witnessContactNo').value;
    let place = this.undertakingForm.get('place').value;


    let tempaltePath = environment.templateURL + 'jedMoneyReceipt.docx';

    loadFile(tempaltePath, function (error: any, content: any) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        defendantName,
        gender,
        dob,
        contactNo,
        parentName,
        judgementNo,
        defedantCid,
        occupation,
        judgementDate,
        attorneyName,
        witnessName,
        witnessCid,
        witnessContactNo,
        place


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
      saveAs(out, 'handReceipt.docx');
    });
    this.enableSaveButton = false;
  }

  saveUndertaking() {
    const undertaking = new Undertaking();
    Object.assign(undertaking, this.undertakingForm.value);
    undertaking.id = this.undertakingId;
    undertaking.enforcement = { id: this.data.enforcementId };
    undertaking.updater = this.credentialService.credentials.userid;
    undertaking.dzongkhag = { id: this.undertakingForm.get('dzongkhagId').value };
    undertaking.gewog = { id: this.undertakingForm.get('gewogId').value };
    undertaking.village = { id: this.undertakingForm.get('villageId').value };
    undertaking.updatedOn = new Date();
    undertaking.updaterName = this.credentialService.credentials.employeename; 
    this.jedService.saveUnderTaking(undertaking).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Successfully saved');
        this.dialogRef.close(true);
      },
      () => {
        this.notificationService.openErrorSnackBar('Can not save now, please try again later');
      }
    );
  }

  incrementSequence() {
    const sequence = new Sequence();
    let lastestSeq = this.sequenceData[0].handReceiptSequence;
    sequence.id = this.sequenceData[0].id;
    sequence.handReceiptSequence = Number(lastestSeq) + 1;
    this.jedService.incrementSequence(sequence).subscribe((res) => {

    });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}

function loadFile(url: any, callback: any) {
  PizZipUtils.getBinaryContent(url, callback);
}

export class Sequence {
  id: number;
  handReceiptSequence: number;
}