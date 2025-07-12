import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoScreenComponent } from './documento-screen.component';

describe('DocumentoScreenComponent', () => {
  let component: DocumentoScreenComponent;
  let fixture: ComponentFixture<DocumentoScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentoScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
