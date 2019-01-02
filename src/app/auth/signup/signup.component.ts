import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserRegistrationDTO } from '../../models/dto/users/user-registration-dto';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  modalRef: BsModalRef;
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private authService: AuthService) {
    this.createForm();
  }

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get('password').value; // to get value in input tag
    let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true} );
    } else {
      return null;
    }
  }

  ngOnInit() {
  }

  private createForm() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required,
                      Validators.minLength(8),
                      Validators.maxLength(20)]],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    }, {
      validator: SignupComponent.MatchPassword // your validation method
    });
  }

  register(template: TemplateRef<any>) {
    console.log(this.signupForm);
    if (this.signupForm.valid) {
      if (this.signupForm.controls['password'].value === this.signupForm.controls['confirmPassword'].value) {
        console.log(this.signupForm.value);
        const userRegistration: UserRegistrationDTO = new UserRegistrationDTO();
        userRegistration.email = this.signupForm.controls['email'].value;
        userRegistration.password = this.signupForm.controls['password'].value;
        userRegistration.username = this.signupForm.controls['username'].value;

        this.isLoading = true;
        this.authService.register(userRegistration)
          .subscribe(
            success => {
              console.log('sukces', success);
              this.isLoading = false;
              this.openModal(template);
              this.router.navigate(['/signin'], { replaceUrl: true });
              },
          error => {
              console.log('error', error);
              this.isLoading = false;
              this.errorMessage = error.error;
            }
          );
      }
    }
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
