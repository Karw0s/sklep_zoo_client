import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { InvoicesMainPageComponent } from './invoices-main-page/invoices-main-page.component';
import { InvoiceEditComponent } from './invoice-edit/invoice-edit.component';


const routes: Routes = [

  {path: 'invoices', component: InvoicesMainPageComponent, children: [
      {path: ':id', component: InvoiceEditComponent},
      {path: ':id/edit', component: InvoiceEditComponent},
    ], }, // canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports : [RouterModule]
})
export class InvoicesRoutingModule { }
