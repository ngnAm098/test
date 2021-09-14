import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationPaymentComponent } from './compensation-payment.component';

describe('CompensationPaymentComponent', () => {
  let component: CompensationPaymentComponent;
  let fixture: ComponentFixture<CompensationPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
