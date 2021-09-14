import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';  
import { JedApiServiceService } from '@app/jed-service/services/jed-api-service.service'; 
import { NavigationExtras, Router } from '@angular/router';
import { NotificationService } from '@app/@core';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-pending-case',
  templateUrl: './pending-case.component.html',
  styleUrls: ['./pending-case.component.scss']
})
export class PendingCaseComponent implements OnInit,AfterViewInit {  

  displayedColumns1: string[] = ['From', 'letterNo', 'letterDate', 'Subject', 'SenderName', 'ReceiptNo'];
  displayedColumns2: string[] = ['From', 'letterNo', 'letterDate', 'Subject', 'SenderName', 'ReceiptNo','caseStatus'];

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator; 
  
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('sort2') sort2: MatSort;

  dataSource1 = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  
  credentials = this.credentialsService.credentials; 

  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  applyFilter2(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  constructor(
    private jedService: JedApiServiceService,
    private router: Router,
    private notificationService: NotificationService,
    private credentialsService: CredentialsService,
  ) { }

  ngOnInit(): void {
    this.getCaseInformation();
  } 

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort1;
    this.dataSource2.paginator = this.paginator2;
    this.dataSource2.sort = this.sort2;
  }

  getCaseInformation() {   
    if (this.role === 'EnforcerHead') { 
      this.jedService.loadCaseInformation().subscribe(
        (data) => {  
          this.dataSource1.data = data; 
        },
        () => {
          this.notificationService.openErrorSnackBar('Error, please try again');
        }
      );   
    } else if (this.role === 'Enforcer') {  
      this.jedService.userPendingTask(this.credentials.userid).subscribe(
        (data) => {  
          this.dataSource2.data = data;     
        },
        () => {
          this.notificationService.openErrorSnackBar('Error, please try again');
        }
      );  
    } else if (this.role === 'AttorneyGeneral'){
      this.jedService.userPendingTask(this.credentials.userid).subscribe(
        (data) => {  
          this.dataSource2.data = data; 
          console.log("cacaacac",data);
          
        },
        () => {
          this.notificationService.openErrorSnackBar('Error, please try again');
        }
      );  
    } 
  } 

  loadDetails(caseId: number,formKey: string,taskIntanceId: string) {
    let navExtras: NavigationExtras = {
      queryParams: {
        caseId,
        formKey,
        taskIntanceId
      },
    };
    this.router.navigate(['/case-detail'], navExtras);
  }
  
  loadEnforcement(enforcementId: number,caseId: number,formKey: string,taskIntanceId: string) {   
    let navExtras: NavigationExtras = {
      queryParams: {
        enforcementId,
        caseId,
        formKey,
        taskIntanceId
      },
    };
    this.router.navigate(['/case-detail'], navExtras);
  } 

  get role(): string | null {
    return this.credentials ? this.credentials.role : null;
  }
}
