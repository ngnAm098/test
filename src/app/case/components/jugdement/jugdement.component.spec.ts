import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JugdementComponent } from './jugdement.component';

describe('JugdementComponent', () => {
  let component: JugdementComponent;
  let fixture: ComponentFixture<JugdementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JugdementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JugdementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
