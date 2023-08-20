import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProfileFormComponent } from './dashboard-profile-form.component';

describe('DashboardProfileFormComponent', () => {
  let component: DashboardProfileFormComponent;
  let fixture: ComponentFixture<DashboardProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardProfileFormComponent]
    });
    fixture = TestBed.createComponent(DashboardProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
