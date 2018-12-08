import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductsFromFileComponent } from './add-products-from-file.component';

describe('AddProductsFromFileComponent', () => {
  let component: AddProductsFromFileComponent;
  let fixture: ComponentFixture<AddProductsFromFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductsFromFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductsFromFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
