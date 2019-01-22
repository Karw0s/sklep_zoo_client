import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  private id: number;
  client;

  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (prams: Params) => {
        this.id = +prams['id'];
        this.client = this.clientService.getClient(this.id);
      }
    );
  }

  deleteClient() {
    this.clientService.deleteClient(this.id).subscribe(
      response => {
        this.router.navigate(['/clients']);
      }
    );
  }
}
