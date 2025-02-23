import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KottuComponent } from './kottu.component';

describe('KottuComponent', () => {
  let component: KottuComponent;
  let fixture: ComponentFixture<KottuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KottuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KottuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
