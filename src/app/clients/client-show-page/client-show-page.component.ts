import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-show-page',
  templateUrl: './client-show-page.component.html',
  styleUrls: ['./client-show-page.component.css']
})
export class ClientShowPageComponent implements OnInit {

  private id: number;
  client: Client;

  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (prams: Params) => {
        this.id = +prams['id'];
        this.clientService.getClient(this.id).subscribe(
          (client: Client) => { this.client = client; }
        );
      }
    );
  }

}
