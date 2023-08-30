import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListFilterComponent } from './product-list-filter.component';

describe('ProductListFilterComponent', () => {
  let component: ProductListFilterComponent;
  let fixture: ComponentFixture<ProductListFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductListFilterComponent]
    });
    fixture = TestBed.createComponent(ProductListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
