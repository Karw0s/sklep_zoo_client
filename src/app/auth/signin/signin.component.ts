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

  error: string;
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  login() {
    this.isLoading = true;
    // this.authenticationService
    //   .login(this.loginForm.value)
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //       this.isLoading = false;
    //     })
    //   )
    //   .subscribe(
    //     credentials => {
    //       // log.debug(`${credentials.username} successfully logged in`);
    //       this.route.queryParams.subscribe(params =>
    //         this.router.navigate([params.redirect || '/'], { replaceUrl: true })
    //       );
    //     },
    //     error => {
    //       // log.debug(`Login error: ${error}`);
    //       this.error = error;
    //     }
    //   );
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }
}
