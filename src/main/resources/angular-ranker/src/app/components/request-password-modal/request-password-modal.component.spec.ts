import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPasswordModalComponent } from './request-password-modal.component';

describe('RequestPasswordModalComponent', () => {
  let component: RequestPasswordModalComponent;
  let fixture: ComponentFixture<RequestPasswordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPasswordModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPasswordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
