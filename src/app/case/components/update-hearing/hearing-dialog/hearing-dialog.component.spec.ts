import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HearingDialogComponent } from './hearing-dialog.component';

describe('HearingDialogComponent', () => {
  let component: HearingDialogComponent;
  let fixture: ComponentFixture<HearingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HearingDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HearingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
