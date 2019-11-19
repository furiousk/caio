import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelemetriaRankingComponent } from './telemetria-ranking.component';

describe('TelemetriaRankingComponent', () => {
  let component: TelemetriaRankingComponent;
  let fixture: ComponentFixture<TelemetriaRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TelemetriaRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelemetriaRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
