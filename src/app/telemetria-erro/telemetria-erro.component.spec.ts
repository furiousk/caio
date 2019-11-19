import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetriaErroComponent } from './telemetria-erro.component';

describe('TelemetriaErroComponent', () => {
  let component: TelemetriaErroComponent;
  let fixture: ComponentFixture<TelemetriaErroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetriaErroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetriaErroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
