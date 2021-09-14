import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeSheetComponent } from './charge-sheet.component';

describe('ChargeSheetComponent', () => {
  let component: ChargeSheetComponent;
  let fixture: ComponentFixture<ChargeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChargeSheetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
