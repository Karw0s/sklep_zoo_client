import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductDetailsDTO } from '../../../models/dto/products/product-details-dto';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {
  @Input() product: ProductDetailsDTO;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }

}
