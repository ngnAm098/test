import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { UndertakingComponent } from '../undertaking.component';

@Component({
  selector: 'app-undertaking-table',
  templateUrl: './undertaking-table.component.html',
  styleUrls: ['./undertaking-table.component.scss']
})
export class UndertakingTableComponent implements OnInit,AfterViewInit  {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['defendantName', 'gender', 'dob', 'cid', 'defendantContactNo',
    'defendantParentName', 'judgementNo', 'judgementDate','extensionDate','edit','delete'
  ];
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
      this.loadUndertakingByEnforcement(this.enforcementId);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  }

  openUnderTakingDialog() {
    const dialogRef = this.dialog.open(UndertakingComponent, {
      width: '1000px',
      data: { 
        action: 'ADD',
        enforcementId: this.enforcementId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {  
        this.loadUndertakingByEnforcement(this.enforcementId)
      } else {
        dialogRef.close();
      }
    }); 
  } 

  loadUndertakingByEnforcement(enforcementId: number) {
    this.jedService.loadUndertakingByEnforcement(enforcementId).subscribe((response) => {
      this.dataSource.data = response;  
    });
  }

  deleteUndertaking(enforcementId: number) { 
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to delete the selected item?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jedService.deleteUndertaking(enforcementId).subscribe(
          (response) => {
            this.notificationService.openSuccessSnackBar('Deleted successfully'); 
            this.loadUndertakingByEnforcement(this.enforcementId);
          },
          () => {
            this.notificationService.openErrorSnackBar('Can not procced, please try again later');
          }
        );
      }else{
        dialogRef.close();
      }
    }); 
  }

  editUndertaking(undertakingId: number) {
    const dialogRef = this.dialog.open(UndertakingComponent, {
      width: '1000px',
      data: { 
        action: 'EDIT',
        undertakingId,
        enforcementId: this.enforcementId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {  
        this.loadUndertakingByEnforcement(this.enforcementId)
      } else {
        dialogRef.close();
      }
    }); 
  }
}
