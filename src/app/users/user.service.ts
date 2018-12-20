import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../models/user-details.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiEndpoint = 'http://localhost:9000';

  constructor(private httpClient: HttpClient) { }

  getUserDetails() {
    return this.httpClient.get(`${this.apiEndpoint}/account/details`);
  }

  updateUserDetails(userDetails: UserDetails) {
    return this.httpClient.put(`${this.apiEndpoint}/account/details`, userDetails);
  }
}
