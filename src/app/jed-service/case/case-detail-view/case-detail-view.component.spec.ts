import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailViewComponent } from './case-detail-view.component';

describe('CaseDetailViewComponent', () => {
  let component: CaseDetailViewComponent;
  let fixture: ComponentFixture<CaseDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
