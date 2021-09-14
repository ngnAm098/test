import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MoneyReceiptComponent } from '../money-receipt/money-receipt.component';
import { EventEmitter } from '@angular/core';
import { EnforcementAttachment } from '@app/jed-service/models/enforcement-attachment';
import { UndertakingComponent } from '../undertaking/undertaking.component';

@Component({
  selector: 'app-compensation',
  templateUrl: './compensation.component.html',
  styleUrls: ['./compensation.component.scss']
})
export class CompensationComponent implements OnInit {

  @Output() compensationTask: EventEmitter<any> = new EventEmitter<any>();

  caseInformationId: number;
  formKey: string;
  taskIntanceId: string;
  enforcementId: number;
  receiptNo: string;

  compensationForm: FormGroup;
  showFinishedTask: boolean = false;
  showUndertaking: boolean = false;
  showMoneyReceipt: boolean = false;

  handReceipt: FormGroup;
  maxDate = new Date();

  constructor(
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private jedService: JedApiServiceService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.caseInformationId = params.caseId;
      this.enforcementId = params.enforcementId;
      this.formKey = params.formKey;
      this.taskIntanceId = params.taskIntanceId;
    });
    this.initializeForm();
  }

  initializeForm() {
    this.compensationForm = this.fb.group({
      compensationType: new FormControl('', Validators.required),
      caseType: new FormControl('', Validators.required),
      action: new FormControl('', Validators.required),
      remark: new FormControl('', Validators.required),
      attachment: new FormControl('', Validators.required),
    });
  }

  compensationType: string;
  checkPenaltyOptions(selectedValue: string) {
    this.compensationType = selectedValue;
    if (selectedValue === 'fullPayment') {
      this.showMoneyReceipt = true;
      this.showUndertaking = false;
    } else {
      this.showMoneyReceipt = false;
      this.showUndertaking = true;
    }
  }

  fileToUpload: File = null;
  uploadDocument(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  proceedCompensation() {
    let taskVariables = [];
    const enforcementAttachment = new EnforcementAttachment();
    if (this.compensationForm.get('compensationType').value === 'fullPayment') {
      taskVariables = [
        { key: 'paidInstantly', value: true },
      ];
      enforcementAttachment.documentName = 'Money Receipt';
      enforcementAttachment.documentType = 'MR';
    } else {
      if (this.compensationForm.get('caseType').value === 'government') {
        taskVariables = [
          { key: 'paidInstantly', value: false },
          { key: 'government', value: true },
          { key: 'assigneeEnforcer', value: 5 },
        ];
      } else {
        taskVariables = [
          { key: 'paidInstantly', value: false },
          { key: 'government', value: false },
        ];
      }
      enforcementAttachment.documentName = 'Under Taking';
      enforcementAttachment.documentType = 'UT';
    }
    enforcementAttachment.enforcement = { id: this.enforcementId };
    enforcementAttachment.file = this.fileToUpload;
    enforcementAttachment.action = this.compensationForm.get('action').value;
    enforcementAttachment.remark = this.compensationForm.get('remark').value;
    enforcementAttachment.taskVariables = taskVariables;
    this.compensationTask.emit(enforcementAttachment);
  }
}

