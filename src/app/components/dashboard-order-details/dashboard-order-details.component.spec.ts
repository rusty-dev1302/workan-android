import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOrderDetailsComponent } from './dashboard-order-details.component';

describe('DashboardOrderDetailsComponent', () => {
  let component: DashboardOrderDetailsComponent;
  let fixture: ComponentFixture<DashboardOrderDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardOrderDetailsComponent]
    });
    fixture = TestBed.createComponent(DashboardOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
