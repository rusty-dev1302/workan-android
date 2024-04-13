import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSupportComponent } from './feedback-support.component';

describe('FeedbackSupportComponent', () => {
  let component: FeedbackSupportComponent;
  let fixture: ComponentFixture<FeedbackSupportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeedbackSupportComponent]
    });
    fixture = TestBed.createComponent(FeedbackSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
