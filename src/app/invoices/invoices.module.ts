import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoicesMainPageComponent } from './invoices-main-page/invoices-main-page.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PersonEditComponent } from './invoice-edit/person-edit/person-edit.component';

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceEditComponent,
    InvoicesMainPageComponent,
    PersonEditComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
