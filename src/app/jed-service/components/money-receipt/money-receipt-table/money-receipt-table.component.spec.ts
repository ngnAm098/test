import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyReceiptTableComponent } from './money-receipt-table.component';

describe('MoneyReceiptTableComponent', () => {
  let component: MoneyReceiptTableComponent;
  let fixture: ComponentFixture<MoneyReceiptTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyReceiptTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyReceiptTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
