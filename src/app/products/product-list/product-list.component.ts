import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { ProductDetailsDTO } from '../../models/dto/products/product-details-dto';
import { ProductDTO } from '../../models/dto/products/product-dto';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products;
  subscription: Subscription;
  private subscription2: Subscription;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.subscription = this.productService.productsChanged
      .subscribe(
        (newProduct: ProductDTO) => {
          this.setProductList();
        }
      );
    this.subscription2 = this.productService.productDeleted
      .subscribe(
        deletedProduct => {
          const index = this.products.findIndex(x => x.id === deletedProduct);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
        }
      );
    this.setProductList();

      // .subscribe(
      //   products => {
      //      = products;
      //   }
      // );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  setProductList() {
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
        next => {
          this.products = next;
        }
      );
  }


}
