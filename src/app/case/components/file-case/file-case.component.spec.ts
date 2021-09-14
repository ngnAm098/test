import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCaseComponent } from './file-case.component';

describe('FileCaseComponent', () => {
  let component: FileCaseComponent;
  let fixture: ComponentFixture<FileCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileCaseComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
