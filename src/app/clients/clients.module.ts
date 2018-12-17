import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsMainPageComponent } from './clients-main-page/clients-main-page.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientItemComponent } from './client-list/client-item/client-item.component';
import { ClientShowPageComponent } from './client-show-page/client-show-page.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ClientsMainPageComponent,
    ClientEditComponent,
    ClientListComponent,
    ClientItemComponent,
    ClientShowPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ClientsRoutingModule
  ]
})
export class ClientsModule { }
