import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { EnforcementFollowUpComponent } from '@app/jed-service/dialog/enforcement-follow-up/enforcement-follow-up.component';
import { EnforcementFollowUp } from '@app/jed-service/models/enforcement';
import { EnforcementAttachment } from '@app/jed-service/models/enforcement-attachment';
import { EnforcementType } from '@app/jed-service/models/enforcement-type';
import { User } from '@app/jed-service/models/user';
import { CaseService } from '@app/jed-service/services/case.service';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-jed-container',
  templateUrl: './jed-container.component.html',
  styleUrls: ['./jed-container.component.scss']
})
export class JedContainerComponent implements OnInit {

  public users$: Observable<User[]>;
  public enforcementType$: Observable<EnforcementType[]>;

  caseInformationId: number;
  caseAttachment: any;
  formKey: string;
  taskIntanceId: string;
  enforcementId: number;
  caseInformation: any;

  @ViewChild('pdfViewer') pdfViewer: ElementRef;
  selectedDoc: number;

  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private route: ActivatedRoute,
    private router: Router,

    private pldService: CaseService,
    private jedService: JedApiServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.caseInformationId = params.caseId;
      this.enforcementId = params.enforcementId;
      this.formKey = params.formKey;
      this.taskIntanceId = params.taskIntanceId;
      this.loadCaseInforamtionDetails(this.caseInformationId);
    });
    this.users$ = this.pldService.loadUsers();
    this.enforcementType$ = this.pldService.loadEnforcementType();
  }

  initializeEnforcement(taskVariables: any) { 
    const dialogRef = this.dialog.open(EnforcementFollowUpComponent, {
      width: '1000px',
      data: {
        enforcementId: this.enforcementId
      }
    });

    dialogRef.afterClosed().subscribe((result) => { 
      if (result) { 
        this.jedService.initializeEnforcement(this.taskIntanceId, taskVariables).subscribe(
          (response) => {
            this.notificationService.openSuccessSnackBar('Successfully Initailize');
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.notificationService.openErrorSnackBar('Error Occured, please try again later');
          }
        );
      }
    }); 
  }

  loadCaseInforamtionDetails(caseInformationId: number) {
    this.pldService.getCaseInformationById(caseInformationId).subscribe((res) => {
      this.caseInformation = res;
    });
  } 

  compensationTask(data: EnforcementAttachment) {
    this.jedService.uploadAttachment(data.file, this.caseInformation.incomingLetter.receiptNo).subscribe(
      (response) => {
        let filePath = String(response);
        data.documentPath = filePath;
        this.jedService.saveAttachmentDetail(data).subscribe((res) => {
          this.saveEnforcementFollowup(data);
          this.completeUserTask(data.taskVariables);
        }); 
      },
      () => {
        this.notificationService.openErrorSnackBar('Attachment could not upload, please try again later');
      }
    ); 
  }

  completeUserTask(taskVariables: any) {   
    this.jedService.completeUserTask(this.taskIntanceId,taskVariables).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Task successfully completed');
        this.router.navigate(['/dashboard']);
      },
      () => {
        this.notificationService.openErrorSnackBar('Task could not proceed, please try again later');
      }
    );  
  }

  instancePayment(data: EnforcementAttachment) {
    this.jedService.uploadAttachment(data.file, this.caseInformation.incomingLetter.receiptNo).subscribe(
      (response) => {
        let filePath = String(response);
        data.documentPath = filePath;
        this.jedService.saveAttachmentDetail(data).subscribe((res) => { 
          this.completeUserTask(data.taskVariables);
        }); 
      },
      () => {
        this.notificationService.openErrorSnackBar('Attachment could not upload, please try again later');
      }
    ); 
  }

  partPayment(data: EnforcementAttachment) {
    this.jedService.uploadAttachment(data.file, this.caseInformation.incomingLetter.receiptNo).subscribe(
      (response) => {
        let filePath = String(response);
        data.documentPath = filePath;
        this.jedService.saveAttachmentDetail(data).subscribe((res) => { 
          this.notificationService.openSuccessSnackBar("Successfully Saved");
        }); 
      },
      () => {
        this.notificationService.openErrorSnackBar('Attachment could not upload, please try again later');
      }
    ); 
  }

  saveEnforcementFollowup(data: any) { 
    const enforcementFollowUp = new EnforcementFollowUp();
    enforcementFollowUp.action =  data.action;
    enforcementFollowUp.enforcement = {id: this.enforcementId};
    enforcementFollowUp.remarks =  data.remark;
    enforcementFollowUp.updateDate = new Date();
    enforcementFollowUp.updaterId = this.credentialService.credentials.userid;
    enforcementFollowUp.updaterName = this.credentialService.credentials.employeename;  
    this.jedService.saveEnforcementFollowUp(enforcementFollowUp).subscribe(
      (response) => { 
      },
      () => {
        this.notificationService.openErrorSnackBar('Can not save followup');
      }
    );
  } 
}
