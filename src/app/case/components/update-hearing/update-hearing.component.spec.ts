import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateHearingComponent } from './update-hearing.component';

describe('UpdateHearingComponent', () => {
  let component: UpdateHearingComponent;
  let fixture: ComponentFixture<UpdateHearingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateHearingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
