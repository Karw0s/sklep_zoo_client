import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductAddPageComponent } from './product-add-page/product-add-page.component';
import { AddProductsFromFileComponent } from './product-add-page/add-products-from-file/add-products-from-file.component';


const routes: Routes = [
  {path: 'products/new', component: ProductAddPageComponent, children: [
      {path: 'file', component: AddProductsFromFileComponent},
      {path: 'on-page', component: ProductEditComponent}
    ]},
  {path: 'products', component: ProductsComponent, children: [
      // {path: 'new', component: ProductEditComponent},
      {path: ':id', component: ProductEditComponent},
      {path: ':id/edit', component: ProductEditComponent},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports : [RouterModule]
})
export class ProductsRoutingModule { }
