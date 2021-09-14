import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CourtHearing } from '@app/case/models/court-hearing';
import { Defendant } from '@app/case/models/defendant';
import { HearingStage } from '@app/case/models/hearing-stage';
import { CaseService } from '@app/case/services/case.service';
import { Observable } from 'rxjs';
import { HearingDialogComponent } from './hearing-dialog/hearing-dialog.component';

@Component({
  selector: 'app-update-hearing',
  templateUrl: './update-hearing.component.html',
  styleUrls: ['./update-hearing.component.scss'],
})
export class UpdateHearingComponent implements OnInit {
  @Input() hearingStages: Observable<HearingStage[]>;

  @Output() addOutput: EventEmitter<CourtHearing> = new EventEmitter<CourtHearing>();
  @Output() closeHearingOutput: EventEmitter<Number> = new EventEmitter<Number>();

  displayedColumns: string[] = ['defendantName', 'defendantCid', 'updateHearingStage', 'updateHearingDetails'];
  dataSource = new MatTableDataSource();
  panelOpenState = false;
  defendantList: any;
  incomingLetterId: number;
  caseId: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  constructor(public dialog: MatDialog, private caseService: CaseService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.incomingLetterId = params.incomingLetterId;
      this.caseId = params.caseId;
    });
    this.checkAllDefendentHearingStage();
  }

  updateHearing(defendantId: number) {
    const dialogRef = this.dialog.open(HearingDialogComponent, {
      width: '700px',
      data: {
        actionType: 'NEW',
        defendantId: defendantId,
        hearingStages: this.hearingStages,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addOutput.emit();
        window.location.reload();
      }
    });
  }

  closeHearing() {
    this.closeHearingOutput.emit();
  }

  showCloseArgument: boolean = false;

  checkAllDefendentHearingStage() {
    this.caseService.getAllDefendants(this.caseId).subscribe((response) => {
      this.defendantList = response;
      for (let i = 0; i < this.defendantList.length; i++) {
        if (this.defendantList[i].defendantHearing === 'Closing Argument') {
          this.showCloseArgument = true;
        } else {
          this.showCloseArgument = false;
        }
      }
    });
  }
}
