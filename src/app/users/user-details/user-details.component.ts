import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from '../user.service';
import { UserDetails } from '../../models/user-details.model';
import { AppUserDetailsDTO } from '../../models/dto/users/app-user-details-dto';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AddressDTO } from '../../models/dto/addresses/address-dto';

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
    this.userService.updateUserDetails(this.userDetailForm.value)
      .pipe(finalize(
        () => this.isSubmitting = false
      ))
      .subscribe(
        (userDetails: UserDetails) => {
          this.userDetails = userDetails;
          this.setFormValue(this.userDetails);
          this.toastr.success('Poprawnie zaktualizowano dane');
        },
        error => {
          if (error.status === 417) {
            this.toastr.error('Dane nie zostały zmienione');
          }
        }
      );
  }

  backClicked() {
    this.location.back();
  }

  setFormValue(userDetails: AppUserDetailsDTO) {
    if (userDetails != null) {
      if (userDetails.address == null) {
        userDetails.address = new AddressDTO();
      }
      this.userDetailForm.patchValue(userDetails);
    }
  }
}
