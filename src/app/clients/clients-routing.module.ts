import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { ClientsMainPageComponent } from './clients-main-page/clients-main-page.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

const routes: Routes = [

  {path: 'clients', component: ClientsMainPageComponent, children: [
      {path: '', component: ClientListComponent},
      {path: 'new', component: ClientEditComponent},
      {path: ':id', component: ClientDetailsComponent},
      {path: ':id/edit', component: ClientEditComponent},
    ], canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports : [RouterModule]
})
export class ClientsRoutingModule { }
