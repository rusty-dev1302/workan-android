import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMapLocationComponent } from './select-map-location.component';

describe('SelectMapLocationComponent', () => {
  let component: SelectMapLocationComponent;
  let fixture: ComponentFixture<SelectMapLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMapLocationComponent]
    });
    fixture = TestBed.createComponent(SelectMapLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
