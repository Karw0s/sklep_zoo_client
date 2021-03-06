import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  declarations: [SigninComponent, SignupComponent, VerifyEmailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AuthRoutingModule
  ]
})
export class AuthModule { }
