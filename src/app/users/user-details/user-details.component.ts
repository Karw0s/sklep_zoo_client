import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../clients/client.service';
import { Address } from '../../models/address.model';
import { Location } from '@angular/common';
import { UserService } from '../user.service';
import { UserDetails } from '../../models/user-details.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetails: UserDetails;
  userDetailForm: FormGroup;

  constructor(private fb: FormBuilder,
              private location: Location,
              private userService: UserService) {
    this.formInit();
  }

  ngOnInit() {
    this.userService.getUserDetails().subscribe(
      (userDetails: UserDetails) => {
        this.userDetails = userDetails;
        this.setFormValue(this.userDetails);
      },
      error => { console.log(error); }
    );
  }

  formInit() {
    this.userDetailForm = this.fb.group({
      id: [null],
      bank: [''],
      bankAccountNumber: [''],
      email: [null, Validators.email],
      companyName: ['', Validators.required],
      nipNumber: ['', Validators.required],
      firstName: [null],
      lastName: [null],
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
    this.userService.updateUserDetails(this.userDetailForm.value).subscribe(
      (userDetails: UserDetails) => {
        this.userDetails = userDetails;
        console.log('updated', userDetails);
        // this.setFormValue(this.userDetails);
      },
      error => { console.log(error); }
    );
  }

  backClicked() {
    this.location.back();
  }

  setFormValue(userDetails: UserDetails) {
    this.userDetailForm.patchValue(userDetails);
  }
}
