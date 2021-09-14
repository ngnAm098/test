import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemandExtensionComponent } from './remand-extension.component';

describe('RemandExtensionComponent', () => {
  let component: RemandExtensionComponent;
  let fixture: ComponentFixture<RemandExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemandExtensionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemandExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
