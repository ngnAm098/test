import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseBriefComponent } from './case-brief.component';

describe('CaseBriefComponent', () => {
  let component: CaseBriefComponent;
  let fixture: ComponentFixture<CaseBriefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseBriefComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
