import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientShowPageComponent } from './client-show-page.component';

describe('ClientShowPageComponent', () => {
  let component: ClientShowPageComponent;
  let fixture: ComponentFixture<ClientShowPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientShowPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientShowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
