import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { CaseService } from '@app/jed-service/services/case.service';

@Component({
  selector: 'app-case-detail-view',
  templateUrl: './case-detail-view.component.html',
  styleUrls: ['./case-detail-view.component.scss']
})
export class CaseDetailViewComponent implements OnInit { 
  
  caseInformationId: number;
  caseInformationData: any;
  caseDetails: any;
  victims: any;
  defendants: any;
  investigationOfficerDetails: any; 

  constructor(
    private pldService: CaseService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.caseInformationId = params.caseId; 
      this.loadCaseInforamtionDetails(params.caseId);
    });
   
  }

  loadCaseInforamtionDetails(caseId: number) { 
    this.pldService.getCaseInformationById(caseId).subscribe((data)=>{ 
      this.caseDetails = data; 
      this.victims = data.victimInformations;  
      this.defendants = data.defendants;
      this.investigationOfficerDetails = data.investigatingOfficer; 
    }); 
  }
}
