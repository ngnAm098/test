import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Defendant } from '@app/case/models/defendant';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { RemandExtension } from '@app/case/models/remand-extension';

@Component({
  selector: 'app-remand-extension',
  templateUrl: './remand-extension.component.html',
  styleUrls: ['./remand-extension.component.scss'],
})
export class RemandExtensionComponent implements OnInit {
  panelOpenState = false;
  remandForm: FormGroup;

  @Input() caseDetails: ReferringAgency;
  @Input() defendants: Defendant[];
  @Input() formKey: string;

  @Output() saveRemand: EventEmitter<RemandExtension> = new EventEmitter<RemandExtension>();
  @Input() remandExtensionDetails: RemandExtension;

  remandExtensionId: number;

  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.checkRemandForm();
  }

  checkRemandForm() {
    this.remandForm = this._formBuilder.group({
      extensionNo: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  public checkRemandCtr = (controlName: string, errorName: string) => {
    return this.remandForm.controls[controlName].hasError(errorName);
  };

  saveRemandEmit(saveType: string) {
    const remandExtension = new RemandExtension();
    if (saveType === 'save') {
      remandExtension.id = this.remandExtensionId;
      Object.assign(remandExtension, this.remandForm.value);
    } else {
      Object.assign(remandExtension, this.remandForm.value);
    }
    this.saveRemand.emit(remandExtension);
  }

  getRemandDetails() {
    if (this.remandExtensionDetails) {
      this.remandExtensionId = this.remandExtensionDetails.id;
      this.remandForm.patchValue({
        extensionNo: this.remandExtensionDetails.extensionNo,
        reason: this.remandExtensionDetails.reason,
      });
    }
  }
}
