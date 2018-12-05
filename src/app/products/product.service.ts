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

  getProduct(id: number) {
    return this.products[id];
  }

  updateProduct(id: number, product: Product) {
    this.products[id] = product;
  }

  addProduct(product: Product) {
    this.products.push(product);
  }
}
