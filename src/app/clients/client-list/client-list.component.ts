import { Component, OnInit } from '@angular/core';
import { ClientsDetailDTO } from '../../models/dto/clients/clients-detail-dto';
import { ClientService } from '../client.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients;
  public searchString: string;

  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.clients = this.clientService.getClients();
    //   .subscribe(
    //   (clients: ClientsDetailDTO[]) => {
    //     console.log(clients);
    //     this.clients = clients;
    //   }
    // );
  }

  deleteClient(id: number) {
    if (confirm('Czy na pewno chcesz usunac tego klienta?')) {
      this.clientService.deleteClient(id).subscribe(
        respons => {
          this.getClientList();
        },
        error1 => {
          console.log(error1);
          this.getClientList();
        }
      );
    }
  }

  getClientList() {
    this.clients = this.clientService.getClients()
    //   .subscribe(
    //   (clients: ClientsDetailDTO[]) => {
    //     console.log(clients);
    //      = clients;
    //   }
    // );
  }
}
