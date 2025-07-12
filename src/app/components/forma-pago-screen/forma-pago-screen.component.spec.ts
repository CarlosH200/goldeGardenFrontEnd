import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoScreenComponent } from './forma-pago-screen.component';

describe('FormaPagoScreenComponent', () => {
  let component: FormaPagoScreenComponent;
  let fixture: ComponentFixture<FormaPagoScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormaPagoScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormaPagoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
