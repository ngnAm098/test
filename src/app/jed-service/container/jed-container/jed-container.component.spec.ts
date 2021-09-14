import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JedContainerComponent } from './jed-container.component';

describe('JedContainerComponent', () => {
  let component: JedContainerComponent;
  let fixture: ComponentFixture<JedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JedContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
