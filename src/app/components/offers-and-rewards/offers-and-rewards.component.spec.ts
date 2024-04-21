import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersAndRewardsComponent } from './offers-and-rewards.component';

describe('OffersAndRewardsComponent', () => {
  let component: OffersAndRewardsComponent;
  let fixture: ComponentFixture<OffersAndRewardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OffersAndRewardsComponent]
    });
    fixture = TestBed.createComponent(OffersAndRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
