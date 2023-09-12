import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrdersTakenComponent } from './dashboard-orders-taken.component';

describe('DashboardOrdersTakenComponent', () => {
  let component: DashboardOrdersTakenComponent;
  let fixture: ComponentFixture<DashboardOrdersTakenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardOrdersTakenComponent]
    });
    fixture = TestBed.createComponent(DashboardOrdersTakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
