import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../clients/client.service';
import { Address } from '../../models/address.model';
import { Location } from '@angular/common';
import { UserService } from '../user.service';
import { UserDetails } from '../../models/user-details.model';
import { AppUserDetailsDTO } from '../../models/dto/users/app-user-details-dto';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userDetails: AppUserDetailsDTO;
  userDetailForm: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder,
              private location: Location,
              private userService: UserService,
              private toastr: ToastrService) {
    this.formInit();
  }

  ngOnInit() {
    this.userService.getUserDetails().subscribe(
      (userDetails: AppUserDetailsDTO) => {
        this.userDetails = userDetails;
        this.setFormValue(this.userDetails);
      },
      error => { console.log(error); }
    );
  }

  formInit() {
    this.userDetailForm = this.fb.group({
      bank: [''],
      bankAccountNumber: [''],
      companyName: ['', Validators.required],
      nipNumber: ['', Validators.required],
      firstName: [null],
      lastName: [null],
      address: this.fb.group({
        street: ['', Validators.required],
        zipCode: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    console.log(this.userDetailForm.value);
    this.userService.updateUserDetails(this.userDetailForm.value)
      .pipe(finalize(
        () => this.isSubmitting = false
      ))
      .subscribe(
      (userDetails: UserDetails) => {
        this.userDetails = userDetails;
        console.log('updated', userDetails);
        // this.setFormValue(this.userDetails);
        this.toastr.success('Poprawnie zaktualizowano dane');
      },
      error => { console.log(error); }
    );
  }

  backClicked() {
    this.location.back();
  }

  setFormValue(userDetails: AppUserDetailsDTO) {
    this.userDetailForm.patchValue(userDetails);
  }
}
