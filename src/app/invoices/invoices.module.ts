import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoicesMainPageComponent } from './invoices-main-page/invoices-main-page.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PersonEditComponent } from './invoice-edit/person-edit/person-edit.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceEditComponent,
    InvoicesMainPageComponent,
    PersonEditComponent,
    InvoiceViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    Ng2SearchPipeModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
