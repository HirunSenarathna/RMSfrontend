import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierOrderManagementComponent } from './cashier-order-management.component';

describe('CashierOrderManagementComponent', () => {
  let component: CashierOrderManagementComponent;
  let fixture: ComponentFixture<CashierOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierOrderManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
