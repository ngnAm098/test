import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service';
import { MoneyReceiptComponent } from '../money-receipt.component';

@Component({
  selector: 'app-money-receipt-table',
  templateUrl: './money-receipt-table.component.html',
  styleUrls: ['./money-receipt-table.component.scss']
})
export class MoneyReceiptTableComponent implements OnInit {

  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['receiptNo', 'victimName','victimCid','amount','judgementNo',
   'judgementDate','chequeNo','edit','delete'];
  @ViewChild('paginator') paginator: MatPaginator;  
  @ViewChild('MatSort') sort: MatSort;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  enforcementId: number;
  totalEnforcementAmount: number;
  balanceEnforcementAmount: number;

  constructor(
    private route: ActivatedRoute,
    private jedService: JedApiServiceService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => { 
      this.enforcementId = params.enforcementId; 
      this.loadMoneyReceivedByEnforcement(this.enforcementId);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; 
  } 

  loadMoneyReceivedByEnforcement(enforcementId: number) { 
    this.jedService.loadEnforcementById(enforcementId).subscribe((response) => { 
      this.totalEnforcementAmount = response.totalAmount;
    });
    this.jedService.loadMoneyReceivedByEnforcement(enforcementId).subscribe((response) => {  
      this.dataSource.data = response;
      this.balanceEnforcementAmount = 0;
      let receivedMoney = 0;
      if(response) {
        for(let i = 0; i < response.length; i++) { 
          receivedMoney = Number(response[i].amount)  + Number(this.balanceEnforcementAmount); 
        } 
        this.balanceEnforcementAmount = Number(this.totalEnforcementAmount) - Number(receivedMoney);
      }else {
        this.balanceEnforcementAmount = this.totalEnforcementAmount;
      }
    });
  }

  openReceiptDialog() {
    const dialogRef = this.dialog.open(MoneyReceiptComponent, {
      width: '1000px',
      data: { 
        action: 'ADD',
        enforcementId: this.enforcementId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {   
        this.loadMoneyReceivedByEnforcement(this.enforcementId);
      } else{
        dialogRef.close();
      }
    }); 
  }  

  deleteReceipt(enforcementId: number) { 
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to delete the selected item?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jedService.deleteReceipt(enforcementId).subscribe(
          (response) => {
            this.notificationService.openSuccessSnackBar('Deleted successfully'); 
            this.loadMoneyReceivedByEnforcement(this.enforcementId);
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

  editReceipt(receiptId: number) {
    const dialogRef = this.dialog.open(MoneyReceiptComponent, {
      width: '1000px',
      data: { 
        action: 'EDIT',
        receiptId,
        enforcementId: this.enforcementId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {  
        this.loadMoneyReceivedByEnforcement(this.enforcementId)
      } else {
        dialogRef.close();
      }
    }); 
  }

}
