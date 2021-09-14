import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@app/@core';
import { MailAttachment } from '@app/case/models/mail-attachment';
import { SendMail } from '@app/case/models/send-mail';
import { CaseService } from '@app/case/services/case.service';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { InvestigationOfficeComponent } from '../investigation-office/investigation-office.component';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComponent implements OnInit {
  mailForm: FormGroup;
  fileToUpload: File = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MailComponent>,
    private notificationService: NotificationService,
    private caseService: CaseService,
    private service: FrontDeskService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.caseDetails = this.data.caseDetails;
    this.incomingLetter = this.data.incomingLetter;
    this.mailForm = this.fb.group({
      mailTo: [this.data.investigationOfficerDetail.email + ';', Validators.required],
      mailCc: [this.data.prosecutorDetail.employeeDetails.email + ';'],
      mailBody: ['', Validators.required],
      mailSubject: ['', Validators.required],
    });
  }

  sendMail() {
    if (this.mailForm.valid) {
      const mailDetails = new SendMail();
      Object.assign(mailDetails, this.mailForm.value);
      mailDetails.fileName = this.fileLocation;
      const mailToArray = this.mailForm.get('mailTo').value.split(';');
      const mailCCArray = this.mailForm.get('mailCc').value.split(';');
      mailDetails.mailTo = mailToArray;
      mailDetails.mailCc = mailCCArray;
      if (this.fileToUpload != null) {
        this.caseService.sendMailWithAttachment(mailDetails).subscribe(
          (response) => {
            this.notificationService.openSuccessSnackBar('Mail successfully sent');
            this.dialogRef.close();
          },
          () => {
            this.notificationService.openErrorSnackBar('Mail could not send, please try again');
          }
        );
      } else {
        return;
      }
    } else {
      return;
    }
  }

  fileLocation: string;

  selectFile(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload) {
      this.service.saveAttachment(this.fileToUpload, this.incomingLetter.letterNo).subscribe(
        (response) => {
          this.fileLocation = String(response);
        },
        () => {
          //this.notificationService.openErrorSnackBar('File could not be saved, please try again');
        }
      );
    } else {
      return;
    }
  }
  caseDetails: any;
  incomingLetter: any;
  investigationOfficerDetail: InvestigationOfficeComponent;

  // uploadAttachment() {
  //   if (this.fileToUpload) {
  //     this.service.saveAttachment(this.fileToUpload,this.incomingLetter.letterNo).subscribe(
  //       (response) => {
  //         this.saveMailAttachmentDetail();
  //       },
  //       () => {
  //         this.notificationService.openErrorSnackBar('File could not be saved, please try again');
  //       }
  //     );
  //   } else {
  //     return;
  //   }
  // }

  saveMailAttachmentDetail() {
    const mailAttachmentDetail = new MailAttachment();
    mailAttachmentDetail.fileName = this.fileLocation;
    this.caseService.saveMailAttachmentDetail(mailAttachmentDetail).subscribe(
      (response) => {
        this.sendMail();
      },
      () => {
        this.notificationService.openErrorSnackBar('File could not be saved, please try again');
      }
    );
  }

  onClose() {
    this.dialogRef.close();
  }
}
