import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoicesRoutingModule } from './invoices-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PersonEditComponent } from './invoice-edit/person-edit/person-edit.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    InvoiceListComponent,
    InvoiceEditComponent,
    PersonEditComponent,
    InvoiceViewComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    PdfViewerModule,
    Ng2SearchPipeModule,
    InvoicesRoutingModule
  ]
})
export class InvoicesModule { }
