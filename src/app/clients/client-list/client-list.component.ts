import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients;
  public searchString: string;

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.clients = this.clientService.getClients();
  }

  deleteClient(id: number) {
    if (confirm('Czy na pewno chcesz usunac tego klienta?')) {
      this.clientService.deleteClient(id).subscribe(
        respons => {
          this.getClientList();
        },
        error1 => {
          this.getClientList();
        }
      );
    }
  }

  getClientList() {
    this.clients = this.clientService.getClients();
  }
}
