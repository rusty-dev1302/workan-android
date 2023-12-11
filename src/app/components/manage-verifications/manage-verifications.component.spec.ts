import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVerificationsComponent } from './manage-verifications.component';

describe('ManageVerificationsComponent', () => {
  let component: ManageVerificationsComponent;
  let fixture: ComponentFixture<ManageVerificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageVerificationsComponent]
    });
    fixture = TestBed.createComponent(ManageVerificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
