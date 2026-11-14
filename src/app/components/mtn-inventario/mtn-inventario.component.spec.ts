import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtnInventarioComponent } from './mtn-inventario.component';

describe('MtnInventarioComponent', () => {
  let component: MtnInventarioComponent;
  let fixture: ComponentFixture<MtnInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MtnInventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtnInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
