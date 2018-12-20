import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: Product[];
  subscription: Subscription;
  private subscription2: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.subscription = this.productService.productsChanged
      .subscribe(
        (newProduct: Product) => {
          this.products = this.products.map(prod => prod.id === newProduct.id ? newProduct : prod);
        }
      );
    this.subscription2 = this.productService.productDeleted
      .subscribe(
        deletedProduct => {
          const index = this.products.findIndex(x => x.id === deletedProduct.id);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
        }
      );
    this.productService.getProducts()
      .pipe(tap(
        products => {
          products.forEach((value, index) => {
            let nett = value.priceNetto;
            nett = parseFloat(nett).toFixed(2);
            value.priceNetto = nett.toString().replace(/\./g, ',');

            let gross = value.priceBrutto;
            gross = parseFloat(gross).toFixed(2);
            value.priceBrutto = gross.toString().replace(/\./g, ',');
          });
        }
      ))
      .subscribe(
        products => {
          this.products = products;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }


}
