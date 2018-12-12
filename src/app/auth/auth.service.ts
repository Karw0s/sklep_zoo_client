import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Credentials {
  // todo: Customize received credentials here
  username: string;
  token: string;
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

  login(context: LoginContext): Observable<Credentials> {
    // todo: implementacja logowanai
    this.httpClient.post(this.apiEndpoint + 'login', context)
      .subscribe(
        response => {
          this.setCredentials({
            username: response['username'],
            token: response['token']
          });
          console.log(this.credentials);
        }
      );

    // this.setCredentials(data, context.remember);
    return of(this._credentials);
  }


  logout(): Observable<boolean> {
    // todo: Customize credentials invalidation here
    this.setCredentials();
    return of(true);
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

  getToken() {
    return this._credentials.token;
  }
}
