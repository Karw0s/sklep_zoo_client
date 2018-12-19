import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../clients/client.service';
import { Address } from '../../models/address.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetailForm: FormGroup;

  constructor(private fb: FormBuilder,
              private location: Location) {
    this.formInit();
  }

  ngOnInit() {

  }

  formInit() {
    this.userDetailForm = this.fb.group({
      id: [null],
      bank: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      email: ['', Validators.required],
      companyName: ['', Validators.required],
      nipNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: this.fb.group({
        id: [null],
        street: ['', Validators.required],
        zipCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    console.log(this.userDetailForm.value);
  }

  backClicked() {
    this.location.back();
  }
}
