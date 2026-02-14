import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertGenericComponent } from './alert-generic.component';

describe('AlertGenericComponent', () => {
  let component: AlertGenericComponent;
  let fixture: ComponentFixture<AlertGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertGenericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
