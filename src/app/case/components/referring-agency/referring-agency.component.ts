import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { CaseType } from '@app/case/models/case-type';
import { Jurisdiction } from '@app/case/models/jurisdiction';
import { Offence } from '@app/case/models/offence';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { CaseService } from '@app/case/services/case.service';
import { Agency } from '@app/front-desk/models/agency';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-referring-agency',
  templateUrl: './referring-agency.component.html',
  styleUrls: ['./referring-agency.component.scss'],
})
export class ReferringAgencyComponent implements OnInit {
  maxDate = new Date();
  @Input() agencys: Observable<Agency[]>;
  @Input() caseTypes: Observable<CaseType[]>;
  @Input() offences: Observable<Offence[]>;
  @Input() jurisdictions: Observable<Jurisdiction[]>;
  @Input() caseDetails: ReferringAgency;

  @Output() saveReferringAgency: EventEmitter<ReferringAgency> = new EventEmitter<ReferringAgency>();
  @Output() toggleInvestigationTitle: EventEmitter<string> = new EventEmitter<string>();

  referringAgencyForm: FormGroup;
  caseId: number;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private route: ActivatedRoute,
    private credentialService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setReferringAgencyData();
  }

  get role(): string | null {
    const credentials = this.credentialService.credentials;
    return credentials ? credentials.role : null;
  }

  initializeForm() {
    this.referringAgencyForm = this.fb.group({
      referringAgencyId: new FormControl('', Validators.required),
      caseName: new FormControl('', Validators.required),
      referralCaseNo: new FormControl('', Validators.required),
      forwardingDate: new FormControl('', Validators.required),
      caseTypeId: new FormControl('', Validators.required),
      offence: new FormControl('', Validators.required),
      evidence: new FormControl(''),
      jurisdictionId: new FormControl('', Validators.required),
      remandPeriod: new FormControl(''),
    });
  }

  setReferringAgencyData() {
    this.route.queryParams.subscribe((params) => {
      this.caseService.loadCaseDetails(params.incomingLetterId).subscribe((response) => {
        if (response.id !== null) {
          this.caseId = response.id;
          this.toggleInvestigationTitle.emit(response.referringAgency.agencyName);
          this.caseService.toggleInvestigationFormDisplay(response.referringAgency.agencyName);
          this.referringAgencyForm.patchValue({
            referringAgencyId: response.referringAgency.id,
            caseName: response.caseName,
            referralCaseNo: response.referralCaseNo,
            forwardingDate: response.forwardingDate,
            caseTypeId: response.caseType.id,
            offence: response.offence,
            evidence: response.evidence,
            jurisdictionId: response.jurisdiction.id,
            remandPeriod: response.remandPeriod,
          });
        }
      });
    });
  }

  saveReferingAgencyEmit() {
    if (this.referringAgencyForm.valid) {
      const referringAgency = new ReferringAgency();
      Object.assign(referringAgency, this.referringAgencyForm.value);
      referringAgency.id = this.caseId;
      referringAgency.jurisdiction = this.referringAgencyForm.get('jurisdictionId').value;
      referringAgency.referringAgency = this.referringAgencyForm.get('referringAgencyId').value;
      referringAgency.caseType = this.referringAgencyForm.get('caseTypeId').value;
      this.saveReferringAgency.emit(referringAgency);
    } else {
      return;
    }
  }

  changeVictimForm(e: MatSelectChange) {
    this.caseService.updateCaseType(e.source.triggerValue);
  }

  toggleTitle(e: MatSelectChange) {
    this.toggleInvestigationTitle.emit(e.source.triggerValue);
    this.caseService.toggleInvestigationFormDisplay(e.source.triggerValue);
  }
}
