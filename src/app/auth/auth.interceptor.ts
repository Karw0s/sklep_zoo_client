import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('intercepted!', req);
    // console.log(this.authService.credentials);
    if (this.authService.credentials) {
      const token = 'Bearer ' + this.authService.credentials.token;
      // const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      // const copiedReq = req.clone({headers: req.headers.set()});
      const copiedReq = req.clone({headers: req.headers.set('Authorization', token)});
      return next.handle(copiedReq);
    } else {
      return next.handle(req);
    }
  }
}
