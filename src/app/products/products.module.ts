import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductItemComponent } from './product-list/product-item/product-item.component';
import { ProductsRoutingModule } from './products-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductAddPageComponent } from './product-add-page/product-add-page.component';
import { AddProductsFromFileComponent } from './product-add-page/add-products-from-file/add-products-from-file.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductItemComponent,
    ProductAddPageComponent,
    AddProductsFromFileComponent
  ],
  imports: [
    CommonModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsRoutingModule
  ]
})
export class ProductsModule {}
