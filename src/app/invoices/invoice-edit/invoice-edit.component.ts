import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from '../invoice.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClientService } from '../../clients/client.service';
import { InvoiceService } from '../invoice.service';
import { tap } from 'rxjs/operators';
import { Client } from '../../models/client.model';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { ProductService } from '../../products/product.service';
import { Product } from '../../products/product.model';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  products: Product[];
  locale = 'pl';
  bsValue = new Date();
  invoice: Invoice = new Invoice();
  client;
  invoiceForm: FormGroup;
  private id: number;
  private editMode = false;
  private clientID: number;
  private filteredProducts: any[] & Product[];

  constructor(private invoiceService: InvoiceService,
              private clientService: ClientService,
              private localeService: BsLocaleService,
              private productService: ProductService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    defineLocale('pl', plLocale);
    this.localeService.use(this.locale);

    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.assignCopy();
      }
    );


    this.route.queryParams.subscribe(
      params => {
        this.clientID = +params.client;
      }
    );
    let invlicePositions = new FormArray([])

    this.route.params.subscribe(
      (prams: Params) => {
        const url: string = this.router.url;

        this.id = +prams['id'];
        this.editMode = prams['id'] != null;

        this.formInit();

        if (this.clientID) {
          this.clientService.getClient(this.clientID).subscribe(
            client => {
              this.client = client;
              this.invoice.buyer = this.client;
              this.invoiceForm.patchValue(this.invoice);
            }
          );
        }

        if (this.editMode) {
          this.invoiceService.getInvoice(this.id).pipe(
            tap(invoice => {
              this.invoiceForm.patchValue(invoice);
            })
          ).subscribe(
            (invoice: Invoice) => { this.invoice = invoice; }
          );
        } else {
          this.addPosition();
        }
      }
    );

  }

  formInit() {

    let id = null;
    let number = '';
    let issueDate = null;

    this.invoiceForm = new FormGroup({
      'id': new FormControl(null),
      'number': new FormControl(number, [Validators.required]),
      'issueDate': new FormControl(this.bsValue.getDate(), [Validators.required]),
      'issuePlace': new FormControl(null, [Validators.required]),
      'saleDate': new FormControl(this.bsValue.getDate(), [Validators.required]),
      'paymentType': new FormControl(null, [Validators.required]),
      'seller': this.newPersonFormGroup(),
      'buyer': this.newPersonFormGroup(),
      'positions': new FormArray([]),
      'priceNet': new FormControl(null, [Validators.required]),
      'priceGross': new FormControl(null, [Validators.required])
    });
  }

  getControls() {
    return (<FormArray>this.invoiceForm.get('positions')).controls;
  }

  getProduct(positionCtrl) {
    return positionCtrl.get('product').contorls;
  }

  addPosition() {
    // const positionControl = new FormControl(null);
    (<FormArray>this.invoiceForm.get('positions')).push(
      new FormGroup({
        'id': new FormControl(null),
        'invoice': new FormControl(null),
        'product': new FormGroup({
            'id': new FormControl(null),
            'catalogNumber': new FormControl(null, Validators.required),
            'name': new FormControl(null, Validators.required),
            'manufacturer': new FormControl(null, Validators.required),
            'unitOfMeasure': new FormControl(null, Validators.required),
            'amount': new FormControl(null, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*(,[0-9]{2})?$/)]),
            'priceNetto': new FormControl(null, [
              Validators.required,
              // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
            ]),
            'priceBrutto': new FormControl(null, [
              Validators.required,
              // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
            ]),
            'tax': new FormControl(null, [Validators.required]),
            'pkiwCode': new FormControl(null, [Validators.required])
        }),
        'quantity': new FormControl(1),
        'nettoValue': new FormControl(null),
        'bruttoValue': new FormControl(null),
        'totalTaxValue': new FormControl(null),
      })
    );
    console.log(this.invoiceForm);
  }

  assignCopy() {
    this.filteredProducts = Object.assign([], this.products);
  }

  filterProducts(value) {
    if (!value) { this.assignCopy(); }
    this.filteredProducts = Object.assign([], this.products).filter(
      item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  onDeletePosition(index: number) {
    (<FormArray>this.invoiceForm.get('positions')).removeAt(index);
  }

  onSelectProduct(i: number, product: Product) {
    (<FormArray>this.invoiceForm.get('positions')).at(i).get('product').patchValue(product);
  }

  setClient(client: Client) {
    this.invoiceForm.get('buyer').patchValue(client);
  }

  newPersonFormGroup() {
    return new FormGroup({
      'id': new FormControl(null),
      'companyName': new FormControl(null, Validators.required),
      'nipNumber': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]), // todo: dodac validator NIP
      'address': new FormGroup({
        'id': new FormControl(null),
        'street': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),
        'country': new FormControl(null, [Validators.required])
      }),
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
    });
  }

  onSubmit() {

  }
}
