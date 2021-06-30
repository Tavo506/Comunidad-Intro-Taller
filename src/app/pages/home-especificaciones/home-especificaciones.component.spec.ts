import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEspecificacionesComponent } from './home-especificaciones.component';

describe('HomeEspecificacionesComponent', () => {
  let component: HomeEspecificacionesComponent;
  let fixture: ComponentFixture<HomeEspecificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEspecificacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEspecificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
