import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  public openSuccessSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  public openInfoSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['info-snackbar'],
    });
  }

  public openWarningSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['warning-snackbar'],
    });
  }

  public openErrorSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
