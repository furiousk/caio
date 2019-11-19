import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutroadComponent } from './outroad.component';

describe('OutroadComponent', () => {
  let component: OutroadComponent;
  let fixture: ComponentFixture<OutroadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutroadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
