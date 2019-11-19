import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedagioComponent } from './pedagio.component';

describe('PedagioComponent', () => {
  let component: PedagioComponent;
  let fixture: ComponentFixture<PedagioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedagioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedagioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
