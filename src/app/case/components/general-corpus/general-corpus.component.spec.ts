import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCorpusComponent } from './general-corpus.component';

describe('GeneralCorpusComponent', () => {
  let component: GeneralCorpusComponent;
  let fixture: ComponentFixture<GeneralCorpusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralCorpusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCorpusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
