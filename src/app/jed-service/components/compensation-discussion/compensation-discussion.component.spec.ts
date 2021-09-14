import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationDiscussionComponent } from './compensation-discussion.component';

describe('CompensationDiscussionComponent', () => {
  let component: CompensationDiscussionComponent;
  let fixture: ComponentFixture<CompensationDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompensationDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompensationDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
