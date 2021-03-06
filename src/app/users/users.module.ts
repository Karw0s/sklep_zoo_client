import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class UsersModule { }
