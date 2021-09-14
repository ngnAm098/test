import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnforcementFollowupComponent } from './enforcement-followup.component';

describe('EnforcementFollowupComponent', () => {
  let component: EnforcementFollowupComponent;
  let fixture: ComponentFixture<EnforcementFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnforcementFollowupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnforcementFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
