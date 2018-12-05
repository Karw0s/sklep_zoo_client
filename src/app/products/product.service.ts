import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { PRODUCTS } from './product-mock';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  products: Product[] = PRODUCTS;

  getProducts() {
    return this.products;
  }
}
