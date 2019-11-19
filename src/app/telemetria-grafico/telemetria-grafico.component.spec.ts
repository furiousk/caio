import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetriaGraficoComponent } from './telemetria-grafico.component';

describe('TelemetriaGraficoComponent', () => {
  let component: TelemetriaGraficoComponent;
  let fixture: ComponentFixture<TelemetriaGraficoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetriaGraficoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetriaGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
