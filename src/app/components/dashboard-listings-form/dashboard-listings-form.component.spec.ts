import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardListingsFormComponent } from './dashboard-listings-form.component';

describe('DashboardListingsFormComponent', () => {
  let component: DashboardListingsFormComponent;
  let fixture: ComponentFixture<DashboardListingsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardListingsFormComponent]
    });
    fixture = TestBed.createComponent(DashboardListingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
