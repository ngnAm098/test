import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandRecipt } from '@app/front-desk/models/hand-recipt';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { environment } from '@env/environment';
// @ts-ignore
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import * as PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { CredentialsService } from '@app/auth';
import { NotificationService } from '@app/@core';

@Component({
  selector: 'app-money-receipt',
  templateUrl: './money-receipt.component.html',
  styleUrls: ['./money-receipt.component.scss']
})
export class MoneyReceiptComponent implements OnInit {

  caseInformationId: number;
  formKey: string;
  taskIntanceId: string;
  enforcementId: number;
  receiptNo: string;
  sequenceData: Sequence[];

  handReceipt: FormGroup;
  enableSaveButton: boolean = true;
  maxDate = new Date();

  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MoneyReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jedService: JedApiServiceService
  ) { }

  ngOnInit(): void {
    this.initializeReciptForm();
    if (this.data.action === 'EDIT') {
      this.getReceiptById();
    }
  }

  initializeReciptForm() {
    this.handReceipt = this.fb.group({
      receiptNo: new FormControl('', Validators.required),
      victimName: new FormControl('', Validators.required),
      victimCid: new FormControl('', Validators.required),
      defendantName: new FormControl('', Validators.required),
      defendantCid: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      judgementNo: new FormControl('', Validators.required),
      judgementDate: new FormControl('', Validators.required),
      chequeNo: new FormControl('', Validators.required),
      amountInWord: new FormControl('', Validators.required),
      receivedDate: new FormControl('', Validators.required),
    });

    this.jedService.loadHandReceiptSeq().subscribe((res) => {
      this.sequenceData = res;
      this.receiptNo = "OAG-JED-Receipt-" + res[0].handReceiptSequence;
      this.handReceipt.patchValue({
        receiptNo: this.receiptNo
      });
    });
  }

  receiptId: number = null;
  getReceiptById() {
    this.jedService.loadReceiptById(this.data.receiptId).subscribe((response) => {
      this.receiptId = response.id; 
      this.handReceipt.patchValue({
        receiptNo: response.receiptNo,
        victimName: response.victimName,
        victimCid: response.victimCid,
        defendantName: response.defendantName,
        defendantCid: response.defendantCid,
        amount: response.amount,
        judgementNo: response.judgementNo,
        judgementDate: response.judgementDate,
        chequeNo: response.chequeNo,
        amountInWord: response.amountInWord,
        receivedDate: response.receivedDate,
      });
    });
  }

  generateReceipt() {
    let receiptNo = this.receiptNo;
    let victimName = this.handReceipt.get('victimName').value;
    let victimCid = this.handReceipt.get('victimCid').value;
    let amount = this.handReceipt.get('amount').value;
    let amountInWord = this.handReceipt.get('amountInWord').value;
    let chequeNo = this.handReceipt.get('chequeNo').value;
    let defedantName = this.handReceipt.get('defendantName').value;
    let defedantCid = this.handReceipt.get('defendantCid').value;
    let judegementNo = this.handReceipt.get('judgementNo').value;
    let judgementDate = this.handReceipt.get('judgementDate').value;

    let tempaltePath = environment.templateURL + 'jedMoneyReceipt.docx';

    loadFile(tempaltePath, function (error: any, content: any) {
      if (error) {
        throw error;
      }
      var zip = new PizZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData({
        receiptNo,
        victimName,
        victimCid,
        amount,
        amountInWord,
        chequeNo,
        defedantName,
        defedantCid,
        judegementNo,
        judgementDate
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

  saveMoneyReceipt() {
    const model = new HandRecipt();
    Object.assign(model, this.handReceipt.value);
    model.id = this.receiptId;
    model.enforcement = { id: this.data.enforcementId };
    model.updater = this.credentialService.credentials.userid;
    model.updatedOn = new Date();

    this.jedService.saveMoneyReceived(model).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Successfully saved');
        this.incrementSequence();
        this.dialogRef.close(true);
      },
      () => {
        this.notificationService.openErrorSnackBar('Can not update now, please try again later');
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


