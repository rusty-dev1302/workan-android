import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemWalletComponent } from './redeem-wallet.component';

describe('RedeemWalletComponent', () => {
  let component: RedeemWalletComponent;
  let fixture: ComponentFixture<RedeemWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RedeemWalletComponent]
    });
    fixture = TestBed.createComponent(RedeemWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
