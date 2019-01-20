import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Subject } from 'rxjs';
import { ProductDetailsDTO } from '../models/dto/products/product-details-dto';
import { ProductDTO } from '../models/dto/products/product-dto';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productsChanged = new Subject<ProductDTO>();
  productDeleted = new Subject<number>();
  products: Product[];

  apiEndpoint = environment.baseApiUrl + '/products';


  constructor(private authService: AuthService,
              private toastr: ToastrService,
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

  addProductFromCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });

    return this.httpClient.post(`${this.apiEndpoint}/csv`, formData, {headers: headers});
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
    const req = this.httpClient.put(`${this.apiEndpoint}/${id}`, product)
      .pipe(finalize( () => this.productsChanged.next(product)));
    return req;
  }

  deleteProduct(id: number) {
    this.httpClient.delete(`${this.apiEndpoint}/${id}`)
      .subscribe(resp => {
          console.log(resp);
          this.toastr.success('Pomyślnie usunięto produkt');
          this.productDeleted.next(id);
        },
        error => {
          this.toastr.error('Błąd przy usuwaniu produktu', 'Błąd');
        });
  }
}
