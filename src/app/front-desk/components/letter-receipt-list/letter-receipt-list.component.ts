import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IncomingLetter } from '@app/front-desk/models/incoming-letter';
import { Observable } from 'rxjs';
import { LetterReceiptComponent } from '../letter-receipt/letter-receipt.component';

@Component({
  selector: 'app-letter-receipt-list',
  templateUrl: './letter-receipt-list.component.html',
  styleUrls: ['./letter-receipt-list.component.scss'],
})
export class LetterReceiptListComponent implements OnInit {
  displayedColumns: string[] = [
    'From',
    'letterNo',
    'letterDate',
    'Subject',
    'SenderName',
    'FileCategory',
    'ReceiptNo',
    'edit',
    'delete',
    'forward',
  ];

  displayedColumns2: string[] = [
    'From',
    'letterNo',
    'letterDate',
    'Subject',
    'SenderName',
    'FileCategory',
    'ReceiptNo',
    'forwardedTo',
    'addedOn',
  ];

  @Input() incomingLetters: Observable<IncomingLetter[]>;
  @Input() registeredIncomingLetters: Observable<IncomingLetter[]>;
  @Output() addOutput: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() editOutput: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() deleteOutput: EventEmitter<Number> = new EventEmitter<Number>();
  @Output() forwardOutput: EventEmitter<Number> = new EventEmitter<Number>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  openAddModal() {
    const dialogRef = this.dialog.open(LetterReceiptComponent, {
      width: '700px',
      data: {
        actionType: 'NEW',
        incomingLetterId: '',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addOutput.emit();
      }
    });
  }

  editIncomingLetterEmit(incomingLetterId: number) {
    this.editOutput.emit(incomingLetterId);
  }

  forwardIncomingLetterEmit(incomingLetterId: number) {
    this.forwardOutput.emit(incomingLetterId);
  }

  deleteIncomingLetterEmit(incomingLetterId: number) {
    this.deleteOutput.emit(incomingLetterId);
  }
}
