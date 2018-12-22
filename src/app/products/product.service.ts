import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';
import { ProductDetailsDTO } from '../models/dto/products/product-details-dto';
import { ProductDTO } from '../models/dto/products/product-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsChanged = new Subject<ProductDTO>();
  productDeleted = new Subject<number>();
  products: Product[];

  apiEndpoint = 'http://localhost:9000/products';


  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }


  getProducts() {
    // return this.products;
    // const req = new HttpRequest('GET', this.authService.apiEndpoint + 'product');

    return this.httpClient.get<ProductDetailsDTO[]>(this.apiEndpoint);
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

  addProduct(product: Product) {
    // this.products.push(product);
    const req = new HttpRequest('POST', this.apiEndpoint, product);

    return this.httpClient.request(req);
  }

  getProduct(id: number) {
    // return this.products[id];
    // return this.products.find(x => x.id === id);

    return this.httpClient.get<ProductDTO>(`${this.apiEndpoint}/${id}`);
  }

  updateProduct(id: number, product: ProductDTO) {
    // this.products[id] = product;
    // const prodID = product.id;
    // const req = new HttpRequest('POST', this.authService.apiEndpoint + 'product/' + prodID, product);
    // return this.httpClient.request(req);
    const req = this.httpClient.put(`${this.apiEndpoint}/${id}`, product);
    this.productsChanged.next(product);
    return req;
  }

  deleteProduct(id: number) {
    this.httpClient.delete(`${this.apiEndpoint}/${id}`).subscribe(resp => console.log(resp));
    this.productDeleted.next(id);
  }
}
