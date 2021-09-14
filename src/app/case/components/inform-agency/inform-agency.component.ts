import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Credentials, CredentialsService } from '@app/auth';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { SendMail } from '@app/case/models/send-mail';
import { SendToAgency } from '@app/case/models/send-to-agency';
import { environment } from '@env/environment';

@Component({
  selector: 'app-inform-agency',
  templateUrl: './inform-agency.component.html',
  styleUrls: ['./inform-agency.component.scss'],
})
export class InformAgencyComponent implements OnInit {
  @Input() caseDetails: ReferringAgency;

  @Output() sendToAgency: EventEmitter<SendToAgency> = new EventEmitter<SendToAgency>();
  @Output() uploadFile: EventEmitter<any> = new EventEmitter<any>();

  agencyForm: FormGroup;
  credentials: Credentials;
  fileToUpload: File = null;

  constructor(private formBuilder: FormBuilder, private credentialService: CredentialsService) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.agencyForm = this.formBuilder.group({
      mailTo: ['', Validators.required],
      mailCc: [''],
      mailBody: ['', Validators.required],
      mailSubject: ['', Validators.required],
      enforcementRequired: ['', Validators.required],
      attachment: ['', Validators.required],
    });
  }

  selectFile(files: FileList) {
    this.fileToUpload = files.item(0);
    this.uploadFile.emit(this.fileToUpload);
  }

  submitForm() {
    var enforcementRequired: boolean;
    const sendToAgencyDetails = new SendToAgency();

    Object.assign(sendToAgencyDetails, this.agencyForm.value);
    sendToAgencyDetails.fileToUpload = this.fileToUpload;
    sendToAgencyDetails.fileName = this.fileToUpload.name;

    if (this.agencyForm.get('enforcementRequired').value === 'Y') {
      enforcementRequired = true;
    } else {
      enforcementRequired = false;
    }

    const taskVariables = [
      { key: environment.enforcementRequired, value: enforcementRequired },
      //{ key: 'assignee', value: this.caseDetails.updatedBy },
    ];

    sendToAgencyDetails.taskVariables = taskVariables;
    this.sendToAgency.emit(sendToAgencyDetails);
  }

  reset() {
    this.agencyForm.reset();
  }
}
