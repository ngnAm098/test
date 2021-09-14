import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { Dzongkhag } from '@app/case/models/dzongkhag';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { PoliceStation } from '@app/case/models/police-station';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { CaseService } from '@app/case/services/case.service';
import { inputs } from '@syncfusion/ej2-angular-schedule/src/schedule/schedule.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-investigation-office',
  templateUrl: './investigation-office.component.html',
  styleUrls: ['./investigation-office.component.scss'],
})
export class InvestigationOfficeComponent implements OnInit {
  @Input() dzongkhags: Observable<Dzongkhag[]>;
  @Input() policeStations: Observable<PoliceStation[]>;
  @Input() investigationOfficerDetails: InvestigationOfficer;

  @Output() getPoliceStationEmit: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() saveInvestigationOfficerEmit: EventEmitter<any> = new EventEmitter<any>();

  investigationOfficerForm: FormGroup;
  referringAgency: String;
  incomingLetterId: number;
  caseId: number;
  investigationId: number;
  localStorageCaseId: number;

  constructor(
    private fb: FormBuilder,
    private caseService: CaseService,
    private route: ActivatedRoute,
    private credentialService: CredentialsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.incomingLetterId = params.incomingLetterId;
      this.caseId = params.caseId;
    });

    this.initializeForm();
    this.setInvestigationOfficerData();
  }

  get role(): string | null {
    const credentials = this.credentialService.credentials;
    return credentials ? credentials.role : null;
  }

  ngDoCheck() {
    this.caseService.getInvestigationFormDisplay.subscribe((response) => {
      this.referringAgency = response;
      if (response === 'Anti-Corruption Commission') {
        this.investigationOfficerForm.controls.policeStation.clearValidators();
        this.investigationOfficerForm.controls.policeStation.updateValueAndValidity();
        this.investigationOfficerForm.patchValue({
          dzongkhag: 14,
        });
      }
    });
    this.caseService.getFormReset.subscribe(() => {
      // this.individualVictimForm.reset();
      // this.organizationVictimForm.reset();
    });
  }

  setInvestigationOfficerData() {
    this.localStorageCaseId = Number(localStorage.getItem('savedCaseId'));
    if (this.caseId || this.localStorageCaseId) {
      if (this.caseId !== undefined) {
        this.caseService.loadInvestigationOfficerDetails(this.caseId).subscribe((response) => {
          if (response) {
            this.investigationId = response.id;
            this.investigationOfficerForm.patchValue({
              investigatorName: response.investigatorName,
              phoneNo: response.phoneNo,
              mobileNo: response.mobileNo,
              email: response.email,
              dzongkhag: response.dzongkhag.id,
              policeStation: response.policeStation.id,
            });
            this.getPoliceStation(response.dzongkhag.id);
          }
        });
      } else {
        this.caseService.loadInvestigationOfficerDetails(this.localStorageCaseId).subscribe((response) => {
          if (response) {
            this.investigationId = response.id;
            this.investigationOfficerForm.patchValue({
              investigatorName: response.investigatorName,
              phoneNo: response.phoneNo,
              mobileNo: response.mobileNo,
              email: response.email,
              dzongkhag: response.dzongkhag.id,
              policeStation: response.policeStation.id,
            });
            this.getPoliceStation(response.dzongkhag.id);
          }
        });
      }
    }
  }

  initializeForm() {
    this.investigationOfficerForm = this.fb.group({
      investigatorName: ['', Validators.required],
      phoneNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      mobileNo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      email: new FormControl(
        '',
        Validators.compose([Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      ),
      dzongkhag: ['', Validators.required],
      policeStation: ['', Validators.required],
    });
  }

  getPoliceStation(dzongkhagId: number) {
    this.getPoliceStationEmit.emit(dzongkhagId);
  }
  saveInvestigationOfficer() {
    if (this.investigationOfficerForm.valid) {
      const investigationOfficer = new InvestigationOfficer();
      if (this.referringAgency === 'Anti-Corruption Commission') {
        Object.assign(investigationOfficer, this.investigationOfficerForm.value);
        investigationOfficer.id = this.investigationId;
        investigationOfficer.caseId = this.caseId;
        investigationOfficer.dzongkhag = { id: this.investigationOfficerForm.get('dzongkhag').value };
        if (investigationOfficer.policeStation === '') {
          investigationOfficer.policeStation = { id: 0 };
        }
      } else {
        Object.assign(investigationOfficer, this.investigationOfficerForm.value);
        investigationOfficer.id = this.investigationId;
        investigationOfficer.caseId = this.caseId;
        investigationOfficer.policeStation = { id: this.investigationOfficerForm.get('policeStation').value };
        investigationOfficer.dzongkhag = { id: this.investigationOfficerForm.get('dzongkhag').value };
      }
      this.saveInvestigationOfficerEmit.emit(investigationOfficer);
    } else {
      return;
    }
  }
}
