import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { NotificationService } from '@app/@core';
import { Credentials, CredentialsService } from '@app/auth';
import { CaseAttachment } from '@app/case/models/case-attachment';
import { CaseService } from '@app/case/services/case.service';
import { Agency } from '@app/front-desk/models/agency';
import { FileCategory } from '@app/front-desk/models/file-category';
import { IncomingLetter } from '@app/front-desk/models/incoming-letter';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { HandReceipt } from '@app/jed-service/models/hand-receipt';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-letter-receipt',
  templateUrl: './letter-receipt.component.html',
  styleUrls: ['./letter-receipt.component.scss'],
})
export class LetterReceiptComponent implements OnInit {
  maxDate = new Date();
  public agencys: Agency[];
  public fileCategorys: FileCategory[];
  fileToUpload: File = null;
  receiptForm: FormGroup;
  incomingLetterId: number;
  actionType: string;
  credentials: Credentials;

  caseAttachment: any;
  file_ext: string;
  pldSequence: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LetterReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FrontDeskService,
    private notificationService: NotificationService,
    private credentialsService: CredentialsService,
    private caseService: CaseService
  ) {
    this.credentials = this.credentialsService.credentials;
  }

  ngOnInit(): void {
    this.incomingLetterId = this.data.incomingLetterId;
    this.actionType = this.data.actionType;
    this.populateFormData();
    this.initializeForm();
  }

  initializeForm() {
    if (this.actionType === 'EDIT') {
      this.receiptForm = this.fb.group({
        agencyId: new FormControl('', Validators.required),
        letterNo: new FormControl('', Validators.required),
        letterDate: new FormControl('', Validators.required),
        subject: new FormControl('', Validators.required),
        senderName: new FormControl('', Validators.required),
        fileCategoryId: new FormControl('', Validators.required),
        receiptNo: new FormControl('', Validators.required),
        attachLetter: new FormControl(''),
      });
      this.service.loadIncomingLetter(this.incomingLetterId).subscribe(
        (response) => {
          this.caseAttachment = response.caseAttachment;
          this.receiptForm.patchValue({
            agencyId: response.agency.id,
            letterNo: response.letterNo,
            letterDate: response.letterDate,
            subject: response.subject,
            senderName: response.senderName,
            fileCategoryId: response.fileCategory.id,
            receiptNo: response.receiptNo,
          });
        },
        () => {
          this.notificationService.openErrorSnackBar('Couldnot load letter details, please try again later');
        }
      );
    } else {
      this.receiptForm = this.fb.group({
        agencyId: new FormControl('', Validators.required),
        letterNo: new FormControl('', Validators.required),
        letterDate: new FormControl('', Validators.required),
        subject: new FormControl('', Validators.required),
        senderName: new FormControl('', Validators.required),
        fileCategoryId: new FormControl('', Validators.required),
        receiptNo: new FormControl('', Validators.required),
        attachLetter: new FormControl('', Validators.required),
      });
    }
  }

  populateFormData() {
    this.service.loadAgencyList().subscribe((response) => {
      this.agencys = response;
    });

    this.service.loadFileCategorys().subscribe((response) => {
      this.fileCategorys = response;
    });
  }

  myFiles: File[] = [];

  selectFile(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  saveAttachment(letterId: number) {
    const newCaseAttachment = new CaseAttachment();
    for (let i = 0; i < this.myFiles.length; i++) {
      let letterName = this.receiptForm.get('receiptNo').value;
      this.service.saveAttachment(this.myFiles[i], letterName).subscribe(
        (response) => {
          newCaseAttachment['documentName'] = this.myFiles[i].name;
          newCaseAttachment['documentPath'] = String(response);
          newCaseAttachment['documentType'] = 'CF';
          newCaseAttachment['incomingLetter'] = { id: letterId };
          this.service.saveIncomingLetterAttachment(newCaseAttachment).subscribe((response) => {});
        },
        () => {
          this.notificationService.openErrorSnackBar('File could not be saved, please try again');
        }
      );
    }
  }

  saveIncomingLetter() {
    if (this.receiptForm.valid) { 
      const incomingLetter = new IncomingLetter();  
      Object.assign(incomingLetter, this.receiptForm.value);    
      incomingLetter.caseDataExist = 0;
      incomingLetter.agency = { id: this.receiptForm.get('agencyId').value };
      incomingLetter.fileCategory = { id: this.receiptForm.get('fileCategoryId').value };
      incomingLetter.updatedBy = this.credentials.userid;
      incomingLetter.updatedByName = this.credentials.username;
      incomingLetter.addedOn = new Date();
      incomingLetter.addedBy = this.credentials.userid;
      incomingLetter.addedByName = this.credentials.username;
      incomingLetter.letterStatus = 'Y';
      incomingLetter.updatedOn = new Date();

      this.service.saveIncomingLetter(incomingLetter).subscribe(
        (response) => {
          this.incomingLetterId = response.id;
          this.saveAttachment(response.id);
          this.updateSequence();
          this.notificationService.openSuccessSnackBar('Letter details has been successfully saved');
        },
        () => {
          this.notificationService.openErrorSnackBar('Letter details couldnot be saved, please try again');
        }
      );
      this.dialogRef.close(true);
    } else {
      return;
    }
  }

  updateIncomingLetter() {
    if (this.receiptForm.valid) {
      const incomingLetter = new IncomingLetter();
      Object.assign(incomingLetter, this.receiptForm.value);
      incomingLetter.id = this.incomingLetterId;
      incomingLetter.caseDataExist = 0;
      incomingLetter.agency = { id: this.receiptForm.get('agencyId').value };
      incomingLetter.fileCategory = { id: this.receiptForm.get('fileCategoryId').value };
      incomingLetter.updatedBy = this.credentials.userid;
      incomingLetter.updatedByName = this.credentials.username;
      incomingLetter.addedOn = new Date();
      incomingLetter.addedBy = this.credentials.userid;
      incomingLetter.addedByName = this.credentials.username;
      incomingLetter.letterStatus = 'Y';
      this.service.saveIncomingLetter(incomingLetter).subscribe(
        () => {
          if (this.myFiles !== []) {
            this.saveAttachment(this.incomingLetterId);
          }
          this.notificationService.openSuccessSnackBar('Letter details has been successfully updated');
        },
        () => {
          this.notificationService.openErrorSnackBar('Letter details couldnot be updated, please try again');
        }
      );
      this.dialogRef.close(true);
    } else {
      return;
    }
  }

  resetForm() {
    this.receiptForm.reset();
    this.fileToUpload = null;
  }

  onClose() {
    this.dialogRef.close();
  }
  createSequence(event: MatSelectChange) {
    this.service.getPldSequence().subscribe(
      (response) => {
        this.pldSequence = event.source.triggerValue + '/' + response.sequence;
        this.receiptForm.patchValue({
          receiptNo: this.pldSequence,
        });
      },
      () => {
        this.notificationService.openErrorSnackBar('Could not fecth sequence');
      }
    );
  }

  updateSequence() {
    this.service.updateSequence().subscribe(
      () => {},
      () => {
        this.notificationService.openErrorSnackBar('Could not update sequence');
      }
    );
  }

  downloadFile(attachmentId: number, fileName: string) {
    this.caseService.downloadFileByAttachmentId(attachmentId).subscribe((response) => {
      let TYPED_ARRAY = new Uint8Array(response);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      let byteChar = atob(STRING_CHAR);
      let byteArray = new Array(byteChar.length);
      for (let i = 0; i < byteChar.length; i++) {
        byteArray[i] = byteChar.charCodeAt(i);
      }
      let uIntArray = new Uint8Array(byteArray);
      let blob = new Blob([uIntArray], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(blob);
      fileSaver.saveAs(blob, fileName);
    });
  }

  addFileArray: any[] = [{ id: 0 }];
  addMoreArray(element: number) {
    let add = {};
    add['id'] = element + 1;
    this.addFileArray.push(add);
  }

  subMoreArray(element: number) {
    if (element !== 0) {
      this.addFileArray.splice(element, 1);
    } else {
      return;
    }
  }
}
