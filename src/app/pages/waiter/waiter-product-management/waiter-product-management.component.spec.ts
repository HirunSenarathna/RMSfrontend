import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterProductManagementComponent } from './waiter-product-management.component';

describe('WaiterProductManagementComponent', () => {
  let component: WaiterProductManagementComponent;
  let fixture: ComponentFixture<WaiterProductManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterProductManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
