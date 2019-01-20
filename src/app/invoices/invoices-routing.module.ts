import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';


const routes: Routes = [

  {path: 'invoices', children: [
      {path: '', component: InvoiceListComponent},
      {path: 'new', component: InvoiceEditComponent},
      {path: ':id', component: InvoiceViewComponent},
      {path: ':id/edit', component: InvoiceEditComponent},
    ], canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports : [RouterModule]
})
export class InvoicesRoutingModule { }
