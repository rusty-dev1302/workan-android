import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAddressDetailsComponent } from './dashboard-address-details.component';

describe('DashboardAddressDetailsComponent', () => {
  let component: DashboardAddressDetailsComponent;
  let fixture: ComponentFixture<DashboardAddressDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardAddressDetailsComponent]
    });
    fixture = TestBed.createComponent(DashboardAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
