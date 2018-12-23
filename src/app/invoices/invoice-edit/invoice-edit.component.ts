import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { UserService } from '../../users/user.service';
import { AppUserDetailsDTO } from '../../models/dto/app-user-details-dto';
import { ProductDetailsDTO } from '../../models/dto/products/product-details-dto';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  products: ProductDetailsDTO[];
  clients: Client[];
  locale = 'pl';
  bsValue = new Date();
  invoice: Invoice = new Invoice();
  client;
  invoiceForm: FormGroup;
  sellerDetailsDTO: AppUserDetailsDTO;
  sellerDetails = false;
  private id: number;
  private editMode = false;
  private clientID: number;
  private filteredProducts: any[] & ProductDetailsDTO[];
  private filteredClients: any[] & Client[];

  constructor(private invoiceService: InvoiceService,
              private clientService: ClientService,
              private localeService: BsLocaleService,
              private productService: ProductService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    defineLocale('pl', plLocale);
    this.localeService.use(this.locale);

    this.productService.getProducts().subscribe(
      (products: ProductDetailsDTO[]) => {
        console.log('products', products);
        this.products = products;
        this.assignProductsCopy();
      }
    );

    this.clientService.getClients().subscribe(
      (clients: Client[]) => {
        this.clients = clients;
        this.assignClientsCopy();
      }
    );

    this.userService.getUserDetails()
      .subscribe(
        (detailsDTO: AppUserDetailsDTO) => {
          this.sellerDetailsDTO = detailsDTO;
          this.invoiceForm.get('issuePlace').patchValue(this.sellerDetailsDTO.address.city);
          this.invoiceForm.get('seller').patchValue(this.sellerDetailsDTO);
          this.sellerDetails = true;
        },
        error => {
          this.sellerDetails = false;
          console.log('cannot get app user details');
        }
      );

    this.route.queryParams.subscribe(
      params => {
        this.clientID = +params.client;
      }
    );
    const invlicePositions = new FormArray([]);

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

    const id = null;
    const number = '';
    const issueDate = null;

    this.invoiceForm = new FormGroup({
      'id': new FormControl(null),
      'number': new FormControl(number, [Validators.required]),
      'issueDate': new FormControl(this.bsValue.getDate(), [Validators.required]),
      'issuePlace': new FormControl(null, [Validators.required]),
      'saleDate': new FormControl(this.bsValue.getDate(), [Validators.required]),
      'paymentType': new FormControl(null, [Validators.required]),
      'seller': new FormGroup({
        'companyName': new FormControl(null, Validators.required),
        'nipNumber': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]), // todo: dodac validator NIP
        'address': new FormGroup({
          'street': new FormControl(null, [Validators.required]),
          'zipCode': new FormControl(null, [Validators.required]),
          'city': new FormControl(null, [Validators.required]),
          'country': new FormControl(null, [Validators.required])
        }),
        'firstName': new FormControl(null),
        'lastName': new FormControl(null),
        'bank': new FormControl(null),
        'bankAccountNumber': new FormControl(null),
      }),
      'buyer': this.newPersonFormGroup(),
      'positions': new FormArray([]),
      'priceNet': new FormControl(0, [Validators.required]),
      'priceGross': new FormControl(0, [Validators.required]),
      'priceTax': new FormControl(0, [Validators.required])
    });
  }

  onSubmit() {
    console.log(this.invoiceForm);
  }

  newPersonFormGroup() {
    return new FormGroup({
      'companyName': new FormControl(null, Validators.required),
      'nipNumber': new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]), // todo: dodac validator NIP
      'address': new FormGroup({
        'street': new FormControl(null, [Validators.required]),
        'zipCode': new FormControl(null, [Validators.required]),
        'city': new FormControl(null, [Validators.required]),
        'country': new FormControl(null, [Validators.required])
      }),
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
    });
  }

  getControls() {
    return (<FormArray>this.invoiceForm.get('positions')).controls;
  }

  getProduct(positionCtrl) {
    return positionCtrl.get('product').contorls;
  }

  addPosition() {
    const tax = 23;
    (<FormArray>this.invoiceForm.get('positions')).push(
      this.formBuilder.group({
          'id': [null, Validators.required],
          'productId': [null, Validators.required],
          'name': [null, Validators.required],
          'unitOfMeasure': [null, Validators.required],
          'quantity': [1, Validators.required],
          'priceNetto': [null, Validators.required],
          'priceBrutto': [null, Validators.required],
          'totalPriceNetto': [null, Validators.required],
          'totalPriceBrutto': [null, Validators.required],
          'tax': [tax, Validators.required],
          'priceTax': [null, Validators.required],
          'totalPriceTax': [null, Validators.required],
        }
      )
    );
    console.log(this.invoiceForm);
  }

  onDeletePosition(index: number) {
    (<FormArray>this.invoiceForm.get('positions')).removeAt(index);
    this.calculateSummary();
  }

  assignProductsCopy() {
    this.filteredProducts = Object.assign([], this.products);
  }

  filterProducts(value) {
    if (!value) { this.assignProductsCopy(); }
    this.filteredProducts = Object.assign([], this.products).filter(
      item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  onSelectProduct(i: number, product: Product) {
    (<FormArray>this.invoiceForm.get('positions')).at(i).patchValue({
      productId: product.id,
      name: product.name,
      unitOfMeasure: product.unitOfMeasure,
      priceNetto: product.priceNetto,
      tax: product.tax,
      priceBrutto: product.priceBrutto,
      totalPriceNetto: this.calculate(1, 0, String(product.priceNetto)),
      totalPriceBrutto: this.calculate(1, +product.tax, String(product.priceNetto)),
      priceTax: this.calculatePriceTax(1, +product.tax, String(product.priceNetto)),
      totalPriceTax: this.calculatePriceTax(1, +product.tax, String(product.priceNetto))
    });
    this.calculateSummary();
  }

  setClient(client: Client) {
    this.invoiceForm.get('buyer').patchValue(client);
  }

  assignClientsCopy() {
    this.filteredClients = Object.assign([], this.clients);
  }

  onSelectClient(client: Client) {
    this.clientService.getClient(client.id).subscribe(
      buyer => this.setClient(<Client>buyer)
    );
  }

  editSeller() {
    this.invoiceForm.get('seller').patchValue(this.sellerDetailsDTO);
    this.sellerDetails = false;
  }

  saveSellerDetails() {
    this.sellerDetailsDTO = this.invoiceForm.get('seller').value;
    this.sellerDetails = true;
  }

  onChange1(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value;
    let tax = position.get('tax').value;
    if (String(tax) === 'zw') {
      tax = 0;
    }
    const priceNetto = position.get('priceNetto').value;
    position.patchValue({
      totalPriceNetto: this.calculate(+quantity, 0, String(priceNetto)),
      totalPriceBrutto: this.calculate(+quantity, +tax, String(priceNetto)),
      priceTax: this.calculatePriceTax(+1, +tax, String(priceNetto)),
      totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
    });
    this.calculateSummary();
  }

  onTotalPriceChange(i: number) {

  }

  calculate(quantity: number, tax: number, net: string) {
    let nett;
    let priceNetto = 0;
    try {
      nett = net.replace(/,/g, '.');
      priceNetto = parseFloat(nett);
    } catch (e) {
      priceNetto = nett;
    }
    const value = (priceNetto + ((priceNetto * tax) / 100)) * quantity;
    return parseFloat(String(value)).toFixed(2).replace(/\./g, ',');
  }

  calculatePriceTax(quantity: number, tax: number, net: string) {
    let nett;
    let priceNetto = 0;
    try {
      nett = net.replace(/,/g, '.');
      priceNetto = parseFloat(nett);
    } catch (e) {
      priceNetto = nett;
    }

    return ((priceNetto * tax) / 100) * quantity;
  }

  calculateSummary() {
    let priceTax = 0;
    let priceNet = 0;
    let priceGross = 0;
    for (let position of this.getControls()) {
      let net = position.get('totalPriceNetto').value;
      let gross = position.get('totalPriceBrutto').value;
      try {
        net = net.replace(/,/g, '.');
        net = parseFloat(net);
      } catch (e) {
        net = position.get('totalPriceNetto').value;
      }
      try {
        gross = gross.replace(/,/g, '.');
        gross = parseFloat(gross);
      } catch (e) {
        gross = position.get('totalPriceBrutto').value;
      }
      priceTax += +position.get('totalPriceTax').value;
      priceNet += +net;
      priceGross += +gross;
    }
    this.invoiceForm.patchValue({
      priceNet: priceNet.toFixed(2),
      priceTax: priceTax.toFixed(2),
      priceGross: priceGross.toFixed(2)
    });

  }
}
