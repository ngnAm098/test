import { Component, Input, OnInit } from '@angular/core';
import { Defendant } from '@app/case/models/defendant';
import { InvestigationOfficer } from '@app/case/models/investigation-officer';
import { ReferringAgency } from '@app/case/models/referring-agency';
import { Victim } from '@app/case/models/victim';

@Component({
  selector: 'app-case-detail-view',
  templateUrl: './case-detail-view.component.html',
  styleUrls: ['./case-detail-view.component.scss'],
})
export class CaseDetailViewComponent implements OnInit {
  @Input() caseDetails: ReferringAgency;
  @Input() victims: Victim[];
  @Input() defendants: Defendant[];
  @Input() investigationOfficerDetails: InvestigationOfficer;

  constructor() {}

  ngOnInit(): void {}

  
}
