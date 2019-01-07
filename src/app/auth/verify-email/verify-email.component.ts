import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  private token: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        params => {
          this.token = params.token;
          this.authService.verifyEmail(this.token);
          this.router.navigate(['/signin'], {replaceUrl: true });
        }
      );
  }

}
