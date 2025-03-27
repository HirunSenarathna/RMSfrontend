import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrderManagementComponent } from './waiter-order-management.component';

describe('WaiterOrderManagementComponent', () => {
  let component: WaiterOrderManagementComponent;
  let fixture: ComponentFixture<WaiterOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterOrderManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
