import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDetails } from '../models/user-details.model';
import { AppUserDetailsDTO } from '../models/dto/users/app-user-details-dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiEndpoint = environment.baseApiUrl;

  constructor(private httpClient: HttpClient) { }

  getUserDetails() {
    return this.httpClient.get(`${this.apiEndpoint}/account/details`);
  }

  updateUserDetails(userDetails: AppUserDetailsDTO) {
    return this.httpClient.put(`${this.apiEndpoint}/account/details`, userDetails);
  }
}
