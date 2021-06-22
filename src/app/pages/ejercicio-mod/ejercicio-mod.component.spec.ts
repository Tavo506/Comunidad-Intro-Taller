import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioModComponent } from './ejercicio-mod.component';

describe('EjercicioModComponent', () => {
  let component: EjercicioModComponent;
  let fixture: ComponentFixture<EjercicioModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjercicioModComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjercicioModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
