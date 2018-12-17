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
  }

  getClient(id: number) {
    return this.httpClient.get(this.apiEndpoint + id);
  }

  createClient(client: Client) {
    return this.httpClient.post(this.apiEndpoint, client);
  }

  updateClient(client: Client) {
    return this.httpClient.post(this.apiEndpoint + client.id, client);
  }
}
