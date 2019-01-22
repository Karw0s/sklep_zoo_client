import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  error = false;
  loginForm: FormGroup;
  isLoading = false;
  redirectTo = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => {
        this.redirectTo = params.redirect;
      }
    );
  }

  login() {
    this.isLoading = true;
    this.authenticationService.login(this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        resp => {
          this.authenticationService.setVerified();
          if (this.redirectTo) {
            this.router.navigate([this.redirectTo], {replaceUrl: true});
          } else {
            this.router.navigate(['/'], {replaceUrl: true});
          }
        },
        error => {
          this.error = true;
        }
      );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
