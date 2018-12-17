import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from '../invoice.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClientService } from '../../clients/client.service';
import { InvoiceService } from '../invoice.service';
import { tap } from 'rxjs/operators';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  bsValue = new Date();
  invoice: Invoice;
  client;
  invoiceForm: FormGroup;
  private id: number;
  private editMode = false;
  private clientID: number;

  constructor(private invoiceService: InvoiceService,
              private clientService: ClientService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.queryParams.subscribe(
    //   params => {
    //     this.clientID = +params.client;
    //   }
    // );
    //
    // this.route.params.subscribe(
    //   (prams: Params) => {
    //     const url: string = this.router.url;
    //
    //     this.id = +prams['id'];
    //     this.editMode = prams['id'] != null;
    //
    //     this.formInit();
    //
    //     if (this.clientID) {
    //       this.clientService.getClient(this.clientID).subscribe(
    //         client => {
    //           this.client = client;
    //           this.invoice.buyer = this.client;
    //           this.invoiceForm.patchValue(this.invoice);
    //         }
    //       );
    //     }
    //
    //     if (this.editMode) {
    //       this.invoiceService.getInvoice(this.id).pipe(
    //         tap(invoice => {
    //           this.invoiceForm.patchValue(invoice);
    //         })
    //       ).subscribe(
    //         (invoice: Invoice) => { this.invoice = invoice; }
    //       );
    //     }
    //   }
    // );

  }

  formInit() {


    this.invoiceForm = new FormGroup({
      'id': new FormControl(null),
      'number': new FormControl(),
      'issueDate': new FormControl(null, []),
      'saleDate': new FormControl(),
      'paymentType': new FormControl(),
      'seller': new FormControl(),
      'buyer': new FormControl(),
      'positions': new FormArray([]),
      'priceNet': new FormControl(),
      'priceGross': new FormControl()
    });
  }

}
