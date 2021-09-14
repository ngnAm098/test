import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth'; 
import { Observable } from 'rxjs';
import { Enforcement, EnforcementFollowUp } from '../models/enforcement';
import { User } from '../models/user';
import { CaseService } from '../services/case.service';
import { JedApiServiceService } from '../services/jed-api-service.service';

@Component({
  selector: 'app-enforcer-assignment',
  templateUrl: './enforcer-assignment.component.html',
  styleUrls: ['./enforcer-assignment.component.scss']
})
export class EnforcerAssignmentComponent implements OnInit {   

  users: User[]
  enforcementForm: FormGroup;
  assignType: string; 
  currentDate: Date;
  caseInformationData: any;

  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private route: ActivatedRoute,

    private pldService: CaseService,
    private jedService: JedApiServiceService,
    private fb: FormBuilder,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<EnforcerAssignmentComponent>,
  ) { 
    this.currentDate = new Date();
  }

  ngOnInit(): void {
    this.initializeForm(); 
    this.loadCaseInforamtionDetails();
  }

  initializeForm() {
    this.enforcementForm = this.fb.group({
      assignTo: new FormControl('', Validators.required), 
      action: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      totalAmount: new FormControl('', Validators.required),
    });
  } 

  loadCaseInforamtionDetails() { 
    this.pldService.getCaseInformationById(this.data.caseId).subscribe((data)=>{ 
      this.caseInformationData = data;   
    }); 

    this.pldService.loadUsers().subscribe((data)=>{ 
      this.users = data;    
    }); 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  formReset() {
    this.enforcementForm.reset();
  }
   

  saveEnforcement() {
    const enforcement = new Enforcement();  
    enforcement.caseId = this.caseInformationData.id;
    enforcement.prosecutor = this.caseInformationData.incomingLetter.forwardedToName;
    enforcement.judgementNo = this.caseInformationData.defendants[0].caseJudgements[0].judgementNo;
    enforcement.judgementDate = this.caseInformationData.defendants[0].caseJudgements[0].judgementDate;
    enforcement.pjeuAssigneeId = this.enforcementForm.get('assignTo').value.id;
    enforcement.pjeuAssigneeName = this.enforcementForm.get('assignTo').value.employeeDetails.employeeName;
    enforcement.pjeuAssignedOn = new Date();
    enforcement.totalAmount = this.enforcementForm.get('totalAmount').value; 
    enforcement.addedOn = new Date();
    enforcement.addedBy = this.credentialService.credentials.userid;
    
    enforcement.followUpAction = this.enforcementForm.get('action').value;
    enforcement.followUpRemarks = this.enforcementForm.get('remark').value; 
    enforcement.updaterName = this.credentialService.credentials.employeename;

    this.jedService.saveEnforcement(enforcement).subscribe(
      () => {
        this.notificationService.openSuccessSnackBar('Successfully Save');
        this.dialogRef.close();
        this.router.navigate(['/dashboard']); 
      },
      () => {
        this.notificationService.openErrorSnackBar('Error, please try again');
      }
    );
    
  }
}
