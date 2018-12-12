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
    const token = 'Bearer ' + this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    // const copiedReq = req.clone({headers: req.headers.set()});
    const copiedReq = req.clone({headers: req.headers.set('Authorization', token)});
    return next.handle(copiedReq);
  }
}
