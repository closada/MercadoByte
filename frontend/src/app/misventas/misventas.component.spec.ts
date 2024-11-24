import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisventasComponent } from './misventas.component';

describe('MisventasComponent', () => {
  let component: MisventasComponent;
  let fixture: ComponentFixture<MisventasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisventasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
