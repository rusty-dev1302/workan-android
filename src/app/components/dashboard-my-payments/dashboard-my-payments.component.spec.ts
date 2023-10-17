import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMyPaymentsComponent } from './dashboard-my-payments.component';

describe('DashboardMyPaymentsComponent', () => {
  let component: DashboardMyPaymentsComponent;
  let fixture: ComponentFixture<DashboardMyPaymentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMyPaymentsComponent]
    });
    fixture = TestBed.createComponent(DashboardMyPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
