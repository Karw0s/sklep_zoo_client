import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddPageComponent } from './product-add-page.component';

describe('ProductAddPageComponent', () => {
  let component: ProductAddPageComponent;
  let fixture: ComponentFixture<ProductAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
