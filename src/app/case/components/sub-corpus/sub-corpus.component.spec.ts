import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCorpusComponent } from './sub-corpus.component';

describe('SubCorpusComponent', () => {
  let component: SubCorpusComponent;
  let fixture: ComponentFixture<SubCorpusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubCorpusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubCorpusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
