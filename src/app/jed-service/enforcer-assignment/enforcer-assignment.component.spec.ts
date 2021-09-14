import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnforcerAssignmentComponent } from './enforcer-assignment.component';

describe('EnforcerAssignmentComponent', () => {
  let component: EnforcerAssignmentComponent;
  let fixture: ComponentFixture<EnforcerAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnforcerAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnforcerAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
