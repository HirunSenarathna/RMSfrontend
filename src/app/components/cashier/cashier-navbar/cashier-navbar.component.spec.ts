import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierNavbarComponent } from './cashier-navbar.component';

describe('CashierNavbarComponent', () => {
  let component: CashierNavbarComponent;
  let fixture: ComponentFixture<CashierNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
