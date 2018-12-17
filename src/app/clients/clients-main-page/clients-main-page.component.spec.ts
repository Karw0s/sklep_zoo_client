import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsMainPageComponent } from './clients-main-page.component';

describe('ClientsMainPageComponent', () => {
  let component: ClientsMainPageComponent;
  let fixture: ComponentFixture<ClientsMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
