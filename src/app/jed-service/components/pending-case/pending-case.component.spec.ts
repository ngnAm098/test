import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingCaseComponent } from './pending-case.component';

describe('PendingCaseComponent', () => {
  let component: PendingCaseComponent;
  let fixture: ComponentFixture<PendingCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
