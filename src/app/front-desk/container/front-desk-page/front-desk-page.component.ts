import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/@core';
import { ConfirmationDialogComponent } from '@app/@shared/confirmation-dialog/confirmation-dialog.component';
import { LetterReceiptComponent } from '@app/front-desk/components';
import { IncomingLetter } from '@app/front-desk/models/incoming-letter';
import { FrontDeskService } from '@app/front-desk/services/front-desk.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-front-desk-page',
  templateUrl: './front-desk-page.component.html',
  styleUrls: ['./front-desk-page.component.scss'],
})
export class FrontDeskPageComponent implements OnInit {
  public incomingLetters$: Observable<IncomingLetter[]>;
  public refreshIncomingLetters$ = new BehaviorSubject<boolean>(false);
  public registeredIncomingLetters$: Observable<IncomingLetter[]>;
  isLoading = false;

  constructor(
    private service: FrontDeskService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.incomingLetters$ = this.refreshIncomingLetters$.pipe(switchMap((_) => this.service.loadUserTaskList('Y')));
    this.registeredIncomingLetters$ = this.refreshIncomingLetters$.pipe(switchMap((_) => this.service.loadUserTaskList('F'))
    );
    this.isLoading = false;
  }

  refreshIncomingLetterList(e: any) {
    this.refreshIncomingLetters$.next(true);
  }

  editIncomingLetterDetails(incomingLetterId: number) {
    const dialogRef = this.dialog.open(LetterReceiptComponent, {
      width: '700px',
      data: {
        actionType: 'EDIT',
        incomingLetterId: incomingLetterId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshIncomingLetters$.next(true);
      }
    });
  }

  deleteIncomingLetterDetails(incomingLetterId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to delete the selected letter?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.deleteIncomingLetter(incomingLetterId).subscribe(
          (response) => {
            this.notificationService.openSuccessSnackBar('Selected letter successfully deleted');
            this.refreshIncomingLetters$.next(true);
          },
          () => {
            this.notificationService.openErrorSnackBar('Selected letter couldnot be deleted, please try again');
          }
        );
      }
    });
  }

  forwardIncomingLetter(incomingLetterId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure, you want to forward the selected letter?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.forwardIncomingLetter(incomingLetterId).subscribe(
          () => {
            this.notificationService.openSuccessSnackBar('Selected letter successfully forwarded');
            this.refreshIncomingLetters$.next(true);
          },
          () => {
            this.notificationService.openErrorSnackBar('Selected letter couldnot be forwarded, please try again');
          }
        );
      }
    });
  }
}
