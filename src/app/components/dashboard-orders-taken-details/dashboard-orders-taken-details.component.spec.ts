import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrdersTakenDetailsComponent } from './dashboard-orders-taken-details.component';

describe('DashboardOrdersTakenDetailsComponent', () => {
  let component: DashboardOrdersTakenDetailsComponent;
  let fixture: ComponentFixture<DashboardOrdersTakenDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardOrdersTakenDetailsComponent]
    });
    fixture = TestBed.createComponent(DashboardOrdersTakenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
