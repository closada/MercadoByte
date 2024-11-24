import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MispublicacionesComponent } from './mispublicaciones.component';

describe('MispublicacionesComponent', () => {
  let component: MispublicacionesComponent;
  let fixture: ComponentFixture<MispublicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MispublicacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MispublicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
