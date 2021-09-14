import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-waiting-period',
  templateUrl: './waiting-period.component.html',
  styleUrls: ['./waiting-period.component.scss'],
})
export class WaitingPeriodComponent implements OnInit {
  @Output() waitingPeriodAppeal: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  appealCase() {
    this.waitingPeriodAppeal.emit();
  }
}
