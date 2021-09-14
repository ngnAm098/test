import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { EnforcerAssignmentComponent } from '@app/jed-service/enforcer-assignment/enforcer-assignment.component';
import { EnforcementType } from '@app/jed-service/models/enforcement-type';
import { User } from '@app/jed-service/models/user';
import { CaseService } from '@app/jed-service/services/case.service';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-case-detail',
  templateUrl: './case-detail.component.html',
  styleUrls: ['./case-detail.component.scss']
})
export class CaseDetailComponent implements OnInit {

  @Input() users: Observable<User[]>;
  @Input() enforcementType: Observable<EnforcementType[]>; 
  @Output() initializeEnforcement: EventEmitter<any> = new EventEmitter<any>();

  caseAttachment: any;
  selectedDoc: number;
  enforcementId: number;
  caseInformationId: number;
  caseInformationData: any; 
  formKey: string;
  taskInstanceId: string;
  selectedEnforcementType: number;
  enforceButton: boolean = true;
  showEnforcerAssignment: boolean = false;
  credentials: any;

  @ViewChild('pdfViewer') pdfViewer: ElementRef;
 
  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private route: ActivatedRoute,

    private pldService: CaseService,
    private jedService: JedApiServiceService,
    public dialog: MatDialog,
  ) { 
    this.credentials = this.credentialService.credentials; 
  }

  ngOnInit(): void {
    this.initialLoadFunction();  
  }

  initialLoadFunction() {
    this.route.queryParams.subscribe((params) => {
      this.enforcementId = params.enforcementId
      this.caseInformationId = params.caseId; 
      this.formKey = params.formKey;
      this.taskInstanceId = params.taskInstanceId;
      this.loadCaseInforamtionDetails(params.caseId);
      this.loadEnforcementFollowUp(this.enforcementId);
    });  
    if (this.role === 'EnforcerHead') { 
      this.showEnforcerAssignment = true;
    } 
  }

  loadCaseInforamtionDetails(caseId: number) { 
    this.pldService.getCaseInformationById(caseId).subscribe(
      (data) => {
        this.caseInformationData = data;
        this.caseAttachment = data.caseAttachement; 
        this.caseDocument(this.caseAttachment[0].id);
      },
      () => {
        this.notificationService.openErrorSnackBar('Error, please try again');
      }
    );  
  }
 
  followupAction: string;
  followupRemark: string;

  loadEnforcementFollowUp(enforcementId: number) { 
    if(enforcementId){
      this.jedService.loadEnforcementFollowup(enforcementId).subscribe(
        (data) => { 
           this.followupAction = data[0].action;
           this.followupRemark = data[0].remarks;
        },
        () => {
          this.notificationService.openErrorSnackBar('Could not load Enforcement follow up, please try again');
        }
      ); 
    } 
  }

  caseDocument(attachmentId: number) {
    this.pldService.downloadCaseDocument(attachmentId).subscribe((response) => {
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
      this.pdfViewer.nativeElement.data = fileURL;
    });
    this.selectedDoc = attachmentId;
  }

  assignTask() {
    const dialogRef = this.dialog.open(EnforcerAssignmentComponent, {  
      data: {
        caseId: this.caseInformationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        dialogRef.close();
      }else{}
      dialogRef.close();
    });
  }

  caseEnforcement() {  
    const taskVariables = [ 
      { key: 'typeofcase', value: String(this.selectedEnforcementType)},
    ];
    this.initializeEnforcement.emit(taskVariables); 
  }

  enableEnforceBtn() { 
    this.enforceButton = false;
  } 

  get role(): string | null {
    return this.credentials ? this.credentials.role : null;
  }
  
}
