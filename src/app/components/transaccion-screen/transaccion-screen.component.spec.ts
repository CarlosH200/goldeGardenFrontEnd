import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaccionScreenComponent } from './transaccion-screen.component';

describe('TransaccionScreenComponent', () => {
  let component: TransaccionScreenComponent;
  let fixture: ComponentFixture<TransaccionScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransaccionScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransaccionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
