import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkanCalendarComponent } from './workan-calendar.component';

describe('WorkanCalendarComponent', () => {
  let component: WorkanCalendarComponent;
  let fixture: ComponentFixture<WorkanCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WorkanCalendarComponent]
    });
    fixture = TestBed.createComponent(WorkanCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
