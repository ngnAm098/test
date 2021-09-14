import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { EnforcementAttachment } from '@app/jed-service/models/enforcement-attachment';

@Component({
  selector: 'app-compensation-payment',
  templateUrl: './compensation-payment.component.html',
  styleUrls: ['./compensation-payment.component.scss']
})
export class CompensationPaymentComponent implements OnInit {

  @Output() instancePayment: EventEmitter<EnforcementAttachment> = new EventEmitter<EnforcementAttachment>();
  @Output() partPayment: EventEmitter<EnforcementAttachment> = new EventEmitter<EnforcementAttachment>();
  @Output() completeUserTask: EventEmitter<any> = new EventEmitter<any>();   

  enableSubmit: boolean = true;
  taskIntanceId: string;
  enforcementId: number;
  formKey: string;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => { 
      this.enforcementId = params.enforcementId; 
      this.taskIntanceId = params.taskIntanceId;
      this.formKey = params.formKey;
    });
  }

  fileToUpload: File = null;
  uploadDocument(files: FileList) {
    this.fileToUpload = files.item(0);
    this.enableSubmit = false;
  }

  proceedTask() { 
    const enforcementAttachment = new EnforcementAttachment();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Click Yes to confirm your decision',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) { 
        let taskVariables = [];
        taskVariables = [
          { key: 'paidInstantly', value: true },
        ];
        enforcementAttachment.documentName = 'Money Receipt';
        enforcementAttachment.documentType = 'MR';
        enforcementAttachment.enforcement = { id: this.enforcementId };
        enforcementAttachment.file = this.fileToUpload; 
        enforcementAttachment.taskVariables = taskVariables;
        this.instancePayment.emit(enforcementAttachment);
      }  
    }); 
  } 

  partPaymentReceipt() {
    const enforcementAttachment = new EnforcementAttachment();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Click Yes to confirm your decision',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {  
        enforcementAttachment.documentName = 'Money Receipt';
        enforcementAttachment.documentType = 'MR';
        enforcementAttachment.enforcement = { id: this.enforcementId };
        enforcementAttachment.file = this.fileToUpload;  
        this.partPayment.emit(enforcementAttachment);
      }  
    }); 
  }

  optionSelected: string = '';

  submissionType(option: string) { 
    let taskVariables = [];
    if(option === 'court') {
      this.optionSelected = null;
    }else if(option === 'paymentDone') { 
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Confirmation',
          message: 'Click Yes to confirm your decision',
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {  
          taskVariables = [
            { key: 'court', value: false },
          ];  
          this.completeUserTask.emit(taskVariables);
        }else{
          dialogRef.close();
        }
      }); 
      this.optionSelected = null;
    }else { 
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Confirmation',
          message: 'Click Yes to confirm your decision',
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {  
          taskVariables = [
            { key: 'court', value: true },
          ];  
          this.completeUserTask.emit(taskVariables);
        }else{
          dialogRef.close();
        }
      });
      this.optionSelected = option;
    }
  }
}
