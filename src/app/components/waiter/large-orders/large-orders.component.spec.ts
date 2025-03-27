import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeOrdersComponent } from './large-orders.component';

describe('LargeOrdersComponent', () => {
  let component: LargeOrdersComponent;
  let fixture: ComponentFixture<LargeOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
