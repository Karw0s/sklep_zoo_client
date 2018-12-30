import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsMainPageComponent } from './clients-main-page/clients-main-page.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ClientsMainPageComponent,
    ClientEditComponent,
    ClientListComponent,
    ClientDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ClientsRoutingModule
  ]
})
export class ClientsModule { }
