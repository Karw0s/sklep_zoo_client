import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.credentials) {
      const token = 'Bearer ' + this.authService.credentials.token;
      const copiedReq = req.clone({headers: req.headers.set('Authorization', token)});
      return next.handle(copiedReq);
    } else {
      return next.handle(req);
    }
  }
}
