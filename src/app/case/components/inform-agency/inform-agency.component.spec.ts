import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformAgencyComponent } from './inform-agency.component';

describe('InformAgencyComponent', () => {
  let component: InformAgencyComponent;
  let fixture: ComponentFixture<InformAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformAgencyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
