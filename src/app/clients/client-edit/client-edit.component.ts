import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientDTO } from '../../models/dto/clients/client-dto';
import { ClientCreateResponseDTO } from '../../models/dto/clients/client-create-response-dto';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {

  private id: number;
  private editMode = false;
  private client: ClientDTO;
  clientForm: FormGroup;


  constructor(private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (prams: Params) => {
        const url: string = this.router.url;

        this.id = +prams['id'];
        this.editMode = prams['id'] != null;


        this.initForm();

        if (this.editMode) {
          this.clientService.getClient(this.id).pipe(
            tap(client => {
              this.clientForm.patchValue(client);
            })
          ).subscribe(
            (client: ClientDTO) => { this.client = client; }
          );
        }
      });

  }

  private initForm() {
    let companyName = '';
    let nipNumber = null;
    let addressStreet = '';
    let zipCode = '';
    let city = '';
    let country = 'Polska';
    let firstName = '';
    let lastName = '';

    this.clientForm = new FormGroup({
      'companyName': new FormControl(companyName, Validators.required),
      'nipNumber': new FormControl(nipNumber, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]), // todo: dodac validator NIP
      'address': new FormGroup({
        'street': new FormControl(addressStreet, [Validators.required]),
        'zipCode': new FormControl(zipCode, [Validators.required]),
        'city': new FormControl(city, [Validators.required]),
        'country': new FormControl(country, [Validators.required])
      }),
      'firstName': new FormControl(firstName),
      'lastName': new FormControl(lastName),
    });
  }

  onSubmit() {
    const client = this.clientForm.value;
    if (!this.editMode) {
      this.clientService.createClient(client).subscribe(
        (success: ClientCreateResponseDTO) => {
          this.router.navigate(['/clients', success.id]);
        }
      );
    } else {
      this.clientService.updateClient(this.id, client).subscribe(
        (success: ClientDTO) => {
          this.router.navigate(['/clients', this.id]);
        }
      );
    }
  }
}
