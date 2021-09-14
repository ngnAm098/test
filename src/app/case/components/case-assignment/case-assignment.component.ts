import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { Credentials, CredentialsService } from '@app/auth';
import { CaseHistory } from '@app/case/models/case-history';
import { Defendant } from '@app/case/models/defendant';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { Victim } from '@app/case/models/victim';
import { CaseService } from '@app/case/services/case.service';

@Component({
  selector: 'app-case-assignment',
  templateUrl: './case-assignment.component.html',
  styleUrls: ['./case-assignment.component.scss'],
})
export class CaseAssignmentComponent implements OnInit {
  credentials: Credentials;
  incomingLetterId: number;
  caseId: number;

  caseHistoryData = new MatTableDataSource();

  public caseDetails: ReferringAgency;
  public victims: Victim[];
  public defendants: Defendant[];
  public investigationOfficerDetails: InvestigationOfficer;
  caseHistoryForm: FormGroup;

  displayedColumns: string[] = ['prosecutor', 'caseDetail', 'updatedOn', 'delete'];

  constructor(
    private caseService: CaseService,
    private notificationService: NotificationService,
    private credentialService: CredentialsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.credentials = this.credentialService.credentials;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.checkGroupAssignment();
  }

  initializeForm() {
    this.caseHistoryForm = this.fb.group({
      caseDetails: new FormControl('', Validators.required),
    });
  }

  checkGroupAssignment() {
    this.route.queryParams.subscribe((parma) => {
      this.incomingLetterId = parma['incomingLetterId'];
    });
    this.populateCaseDetails(this.incomingLetterId);
    this.getCaseHistory(this.incomingLetterId);
    // this.caseService.getGroupAssignment(this.credentials.userid,this.incomingLetterId).subscribe((response) => {
    //   if(response.length) {
    //     this.incomingLetterId = response[0].id;

    //   }
    // });
  }

  populateCaseDetails(incomingLetterId: number) {
    this.caseService.loadCaseDetails(incomingLetterId).subscribe((response1) => {
      this.caseDetails = response1;
      this.caseId = response1.id;
      this.caseService.getAllVictims(this.caseId).subscribe((response2) => {
        this.victims = response2;
      });
      this.caseService.getAllDefendants(this.caseId).subscribe((response3) => {
        this.defendants = response3;
      });
      this.caseService.loadInvestigationOfficerDetails(this.caseId).subscribe((response4) => {
        this.investigationOfficerDetails = response4;
      });
    });
  }

  submitCaseHistory() {
    const caseHistory = new CaseHistory();
    Object.assign(caseHistory, this.caseHistoryForm.value);
    caseHistory.updatedBy = this.credentials.employeename;
    caseHistory.updatedOn = new Date();
    caseHistory.incomingLetter = { id: this.incomingLetterId };

    this.caseService.saveCaseHistory(caseHistory).subscribe(
      (response) => {
        this.notificationService.openSuccessSnackBar('Case history successfully saved');
        this.getCaseHistory(this.incomingLetterId);
      },
      () => {
        this.notificationService.openErrorSnackBar('Case history couldnot saved, please try again');
      }
    );
  }

  getCaseHistory(incomingLetterId: number) {
    if (incomingLetterId) {
      this.caseService.getCaseHistoryByIncomingLetter(incomingLetterId).subscribe(
        (response) => {
          this.caseHistoryData.data = response;
        },
        () => {}
      );
    }
  }

  deleteCaseHistory(id: number) {
    this.caseService.deleteCaseHistoryById(id).subscribe(
      (response) => {
        this.getCaseHistory(this.incomingLetterId);
        this.notificationService.openSuccessSnackBar('Case history successfully deleted');
      },
      () => {
        this.notificationService.openErrorSnackBar('Case history couldnot deleted, please try again');
      }
    );
  }
}
