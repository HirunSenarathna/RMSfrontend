import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortEatsComponent } from './short-eats.component';

describe('ShortEatsComponent', () => {
  let component: ShortEatsComponent;
  let fixture: ComponentFixture<ShortEatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortEatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortEatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
