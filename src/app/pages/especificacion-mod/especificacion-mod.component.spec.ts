import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecificacionModComponent } from './especificacion-mod.component';

describe('EspecificacionModComponent', () => {
  let component: EspecificacionModComponent;
  let fixture: ComponentFixture<EspecificacionModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecificacionModComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecificacionModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
