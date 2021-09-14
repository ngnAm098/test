import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndertakingTableComponent } from './undertaking-table.component';

describe('UndertakingTableComponent', () => {
  let component: UndertakingTableComponent;
  let fixture: ComponentFixture<UndertakingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndertakingTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndertakingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
