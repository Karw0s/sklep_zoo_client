import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[];
  subscription: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.subscription = this.productService.productsChanged
      .subscribe(
        (newProduct: Product) => {
        this.products = this.products.map(prod => prod.id === newProduct.id ? newProduct : prod);
        }
      );
    this.productService.getProducts()
      .subscribe(
        products => {
          this.products = products;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
