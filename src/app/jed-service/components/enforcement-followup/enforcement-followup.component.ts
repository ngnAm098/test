import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { EnforcementFollowUpComponent } from '@app/jed-service/dialog/enforcement-follow-up/enforcement-follow-up.component';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';

@Component({
  selector: 'app-enforcement-followup',
  templateUrl: './enforcement-followup.component.html',
  styleUrls: ['./enforcement-followup.component.scss']
})
export class EnforcementFollowupComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['action', 'remark','updater','updateDate','edit'];
  @ViewChild('paginator') paginator: MatPaginator;  
  @ViewChild('MatSort') sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  enforcementId: number;

  constructor(
    private route: ActivatedRoute,
    private jedService: JedApiServiceService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => { 
      this.enforcementId = params.enforcementId; 
      this.loadEnforcementFollowup(this.enforcementId);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  loadEnforcementFollowup(enforcementId: number) {
    this.jedService.loadEnforcementFollowup(enforcementId).subscribe((response) => { 
      this.dataSource.data = response;  
    });
  }

  openEnforcementFollowup() {
    const dialogRef = this.dialog.open(EnforcementFollowUpComponent, {
      width: '1000px',
      data: { 
        action: 'ADD',
        enforcementId: this.enforcementId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {   
        this.loadEnforcementFollowup(this.enforcementId);
      } else{
        dialogRef.close();
      }
    }); 
  }

}
