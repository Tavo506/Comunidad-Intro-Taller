import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecificacionVerComponent } from './especificacion-ver.component';

describe('EspecificacionVerComponent', () => {
  let component: EspecificacionVerComponent;
  let fixture: ComponentFixture<EspecificacionVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecificacionVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspecificacionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
