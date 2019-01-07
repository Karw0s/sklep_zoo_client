import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserRegistrationDTO } from '../models/dto/users/user-registration-dto';
import { tap } from 'rxjs/operators';
import { EmailVerificationDTO } from '../models/dto/email-verification-dto';

export interface Credentials {
  username: string;
  token: string;
  exp: string;
  verified: boolean;
}

export interface LoginContext {
  username: string;
  password: string;
}

const credentialsKey = 'credentials';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _credentials: Credentials | null;
  apiEndpoint = 'http://localhost:9000/';

  constructor(private httpClient: HttpClient) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  login(context: LoginContext) {
    return this.httpClient.post(this.apiEndpoint + 'login', context)
      .pipe(tap(
        response => {
          this.setCredentials({
            username: response['username'],
            token: response['token'],
            exp: response['exp'],
            verified: false
          });
          console.log('authService', this.credentials);
        }
      ));
  }

  logout(): Observable<boolean> {
    this.setCredentials();
    return of(true);
  }

  register(userRegistrationDTO: UserRegistrationDTO) {
    return this.httpClient.post(`${this.apiEndpoint}users/sign-up`, userRegistrationDTO);
  }

  verifyEmail(token: string) {
    this.httpClient.get(`${this.apiEndpoint}verify`, {params: new HttpParams().set('token', token)}).subscribe();
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  setVerified() {
    this.httpClient.get(`${this.apiEndpoint}account/verified`)
      .subscribe(
        (res: EmailVerificationDTO) => {
        this._credentials.verified = res.verified;
        this.setCredentials(this._credentials);
      }
    );
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }
}
