import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriedRiceComponent } from './fried-rice.component';

describe('FriedRiceComponent', () => {
  let component: FriedRiceComponent;
  let fixture: ComponentFixture<FriedRiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriedRiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriedRiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
