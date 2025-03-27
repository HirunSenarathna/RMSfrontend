import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterNavbarComponent } from './waiter-navbar.component';

describe('WaiterNavbarComponent', () => {
  let component: WaiterNavbarComponent;
  let fixture: ComponentFixture<WaiterNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
