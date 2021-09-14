import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnforcementFollowUpComponent } from './enforcement-follow-up.component';

describe('EnforcementFollowUpComponent', () => {
  let component: EnforcementFollowUpComponent;
  let fixture: ComponentFixture<EnforcementFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnforcementFollowUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnforcementFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
