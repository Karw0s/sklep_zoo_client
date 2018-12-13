import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesMainPageComponent } from './invoices-main-page.component';

describe('InvoicesMainPageComponent', () => {
  let component: InvoicesMainPageComponent;
  let fixture: ComponentFixture<InvoicesMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicesMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
