import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterSidebarComponent } from './waiter-sidebar.component';

describe('WaiterSidebarComponent', () => {
  let component: WaiterSidebarComponent;
  let fixture: ComponentFixture<WaiterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
