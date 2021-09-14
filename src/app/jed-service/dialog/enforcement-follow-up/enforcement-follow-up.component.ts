import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CredentialsService } from '@app/auth';
import { EnforcementFollowUp } from '@app/jed-service/models/enforcement';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';

@Component({
  selector: 'app-enforcement-follow-up',
  templateUrl: './enforcement-follow-up.component.html',
  styleUrls: ['./enforcement-follow-up.component.scss']
})
export class EnforcementFollowUpComponent implements OnInit {

  enforcementForm: FormGroup;
  enforcementId: number;

  constructor(
    private jedService: JedApiServiceService,
    private fb: FormBuilder,
    private credentialService: CredentialsService,
    public dialogRef: MatDialogRef<EnforcementFollowUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EnforcementFollowUpComponent
  ) { }

  ngOnInit(): void {
    this.initializeForm(); 
  }

  initializeForm() {
    this.enforcementId = this.data.enforcementId; 
    this.enforcementForm = this.fb.group({ 
      action: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required), 
    });
  } 

  resetForm() {
    this.enforcementForm.reset();
  }

  saveFollowUp() { 
    const enforcementFollowUp = new EnforcementFollowUp();
    enforcementFollowUp.action =  this.enforcementForm.get('action').value;
    enforcementFollowUp.enforcement = {id: this.enforcementId};
    enforcementFollowUp.remarks =  this.enforcementForm.get('remark').value;
    enforcementFollowUp.updateDate = new Date();
    enforcementFollowUp.updaterId = this.credentialService.credentials.userid;
    enforcementFollowUp.updaterName = this.credentialService.credentials.employeename;  
    this.jedService.saveEnforcementFollowUp(enforcementFollowUp).subscribe((res) => {
      this.dialogRef.close(true);
    });
  } 
}
