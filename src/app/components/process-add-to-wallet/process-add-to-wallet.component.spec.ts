import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessAddToWalletComponent } from './process-add-to-wallet.component';

describe('ProcessAddToWalletComponent', () => {
  let component: ProcessAddToWalletComponent;
  let fixture: ComponentFixture<ProcessAddToWalletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProcessAddToWalletComponent]
    });
    fixture = TestBed.createComponent(ProcessAddToWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
