import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercicioVerComponent } from './ejercicio-ver.component';

describe('EjercicioVerComponent', () => {
  let component: EjercicioVerComponent;
  let fixture: ComponentFixture<EjercicioVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjercicioVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjercicioVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
