import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOtpModalComponent } from './enter-otp-modal.component';

describe('EnterOtpModalComponent', () => {
  let component: EnterOtpModalComponent;
  let fixture: ComponentFixture<EnterOtpModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnterOtpModalComponent]
    });
    fixture = TestBed.createComponent(EnterOtpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
