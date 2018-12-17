import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoicesMainPageComponent } from './invoices-main-page/invoices-main-page.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceEditComponent,
    InvoicesMainPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
