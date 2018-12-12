import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { PRODUCTS } from './product-mock';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsChanged = new Subject<Product[]>();
  products: Product[] = PRODUCTS;

  apiEndpoint = 'http://localhost:9000';


  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }


  getProducts() {
    return this.products;
    // const req = new HttpRequest('GET', this.authService.apiEndpoint + 'product');

    // return this.httpClient.get<Product[]>(this.authService.apiEndpoint + 'product', {
    //   observe: 'body',
    //   responseType: 'json'
    // })
    //   .pipe(map(
    //     (products) => {
    //       return products;
    //   }
    //   ))
    //   .subscribe(
    //     (products) => {
    //       this.products = products;
    //     }
    //   );
  }

  getProduct(id: number) {
    // return this.products[id];
    // return this.products.find(x => x.id === id);

    return this.httpClient.get<Product>(this.apiEndpoint + '/product/' + id);
  }

  updateProduct(id: number, product: Product) {
    this.products[id] = product;
    // const prodID = product.id;
    // const req = new HttpRequest('POST', this.authService.apiEndpoint + 'product/' + prodID, product);
    //
    // return this.httpClient.request(req);
  }

  addProduct(product: Product) {
    this.products.push(product);
    const req = new HttpRequest('POST', this.authService.apiEndpoint + 'product/add', product);

    return this.httpClient.request(req);
  }
}
