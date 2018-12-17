import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Invoice } from '../invoice.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {

  invoice: Invoice;
  invoiceForm: FormGroup;

  constructor() { }

  ngOnInit() {


    this.formInit();
  }

  formInit() {



    this.invoiceForm = new FormGroup({
      'id': new FormControl(null),
      'number': new FormControl(),
      'issueDate': new FormControl(),
      'saleDate': new FormControl(),
      'paymentType': new FormControl(),
      'seller': new FormControl(),
      'buyer': new FormControl(),
      'positions': new FormArray([]),
      'priceNet': new FormControl(),
      'priceGross': new FormControl()
    })
  }

}
