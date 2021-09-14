import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPeriodComponent } from './waiting-period.component';

describe('WaitingPeriodComponent', () => {
  let component: WaitingPeriodComponent;
  let fixture: ComponentFixture<WaitingPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaitingPeriodComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
