import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductDetailsDTO } from '../../models/dto/products/product-details-dto';
import { ProductDTO } from '../../models/dto/products/product-dto';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  products: ProductDetailsDTO[];
  productChangeSub: Subscription;
  private deleteSubscription: Subscription;
  public searchString: string;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productChangeSub = this.productService.productsChanged
      .subscribe(
        (newProduct: ProductDTO) => {
          this.setProductList();
        }
      );
    this.deleteSubscription = this.productService.productDeleted
      .subscribe(
        deletedProduct => {
          const index = this.products.findIndex(x => x.id === deletedProduct);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
        }
      );
    this.setProductList();
  }

  ngOnDestroy() {
    this.productChangeSub.unsubscribe();
    this.deleteSubscription.unsubscribe();
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
