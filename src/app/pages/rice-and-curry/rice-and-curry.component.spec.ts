import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiceAndCurryComponent } from './rice-and-curry.component';

describe('RiceAndCurryComponent', () => {
  let component: RiceAndCurryComponent;
  let fixture: ComponentFixture<RiceAndCurryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiceAndCurryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiceAndCurryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
