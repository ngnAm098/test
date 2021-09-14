import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndertakingComponent } from './undertaking.component';

describe('UndertakingComponent', () => {
  let component: UndertakingComponent;
  let fixture: ComponentFixture<UndertakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndertakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
