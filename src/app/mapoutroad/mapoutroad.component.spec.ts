import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapoutroadComponent } from './mapoutroad.component';

describe('MapoutroadComponent', () => {
  let component: MapoutroadComponent;
  let fixture: ComponentFixture<MapoutroadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapoutroadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapoutroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
