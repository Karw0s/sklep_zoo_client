import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  apiEndpoint = 'http://localhost:9000/clients';

  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }

  getClients() {
    return this.httpClient.get(this.apiEndpoint);                         // clients-details-dto
  }

  getClient(id: number) {
    return this.httpClient.get(`${this.apiEndpoint}/${id}`);          // client-dto
  }

  createClient(client: Client) {
    return this.httpClient.post(this.apiEndpoint, client);                // ClientCreateResponseDTO
  }

  updateClient(id: number, client: Client) {
    return this.httpClient.put(`${this.apiEndpoint}/${id}`, client);  // client-dto
  }

  deleteClient(id: number) {
    return this.httpClient.delete(`${this.apiEndpoint}/${id}`);
  }
}
