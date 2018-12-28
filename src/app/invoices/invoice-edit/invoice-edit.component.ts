import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Invoice } from '../invoice.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClientService } from '../../clients/client.service';
import { InvoiceService } from '../invoice.service';
import { finalize, tap } from 'rxjs/operators';
import { Client } from '../../models/client.model';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { ProductService } from '../../products/product.service';
import { Product } from '../../products/product.model';
import { UserService } from '../../users/user.service';
import { AppUserDetailsDTO } from '../../models/dto/app-user-details-dto';
import { ProductDetailsDTO } from '../../models/dto/products/product-details-dto';
import { InvoiceDTO } from '../../models/dto/invoice/invoice-dto';
import index from '@angular/cli/lib/cli';
import { InvoicePositionDTO } from '../../models/dto/invoice/invoice-position-dto';
import { formatDate } from '@angular/common';
import { ClientDTO } from '../../models/dto/clients/client-dto';
import { InvoiceNextNumberDTO } from '../../models/dto/invoice/invoice-next-number-dto';
import { HttpErrorResponse } from '@angular/common/http';

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
  invoice: InvoiceDTO = new InvoiceDTO();
  client;
  invoiceForm: FormGroup;
  sellerDetailsDTO: AppUserDetailsDTO;
  sellerDetails = false;
  isSubmitting = false;
  isLoading = false;
  invoiceNumber: string;
  displayPKWiUCode = false;
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

    this.productService.getProducts()
      .subscribe(
      (products: ProductDetailsDTO[]) => {
        console.log('products', products);
        this.products = products;
        this.assignProductsCopy();
      });

    this.clientService.getClients()
      .subscribe(
      (clients: Client[]) => {
        this.clients = clients;
        this.assignClientsCopy();
      });

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
              this.client.id = this.clientID;
              console.log('client', client);
              console.log('buyer', this.invoice.buyer);
              this.invoice.buyer = this.client;
              this.invoiceForm.patchValue(this.invoice);
            }
          );
        }

        if (url.match('/new$')) {
          this.isLoading = true;
          this.userService.getUserDetails()
            .pipe(finalize(
              () => this.isLoading = false
            ))
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
        }
      }
    );

  }

  formInit() {

    const id = null;
    const number = '';


    this.invoiceForm = this.formBuilder.group({
      'number': [number, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*\/(1[0-2]|0[1-9])\/[0-9]{4}$/)]],
      'issueDate': [this.bsValue, [Validators.required]],
      'issuePlace': [null, [Validators.required]],
      'saleDate': [this.bsValue, [Validators.required]],
      'paymentType': [null, [Validators.required]],
      'seller': this.formBuilder.group({
        'companyName': [null, Validators.required],
        'nipNumber': [null, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // todo: dodac validator NIP
        'address': this.formBuilder.group({
          'street': [null, [Validators.required]],
          'zipCode': [null, [Validators.required]],
          'city': [null, [Validators.required]],
          'country': [null, [Validators.required]]
        }),
        'firstName': [null],
        'lastName': [null],
        'bank': [null],
        'bankAccountNumber': [null],
      }),
      'buyer': this.newPersonFormGroup(),
      'positions': this.formBuilder.array([]),
      'priceNet': [0, [Validators.required]],
      'priceGross': [0, [Validators.required]],
      'priceTax': [0, [Validators.required]],
      'showPKWIUCode': [this.displayPKWiUCode],
    });


    if (this.editMode) {
      this.isLoading = true;
      this.invoiceService.getInvoice(this.id)
        .pipe(finalize(
          () => this.isLoading = false
        ))
        .subscribe(
          (invoice: InvoiceDTO) => {
            this.invoice = invoice;
            console.log('faktura get', invoice);
            this.invoiceForm.patchValue(invoice);
            this.invoiceForm.patchValue({
              issueDate: new Date(invoice.issueDate),
              saleDate: new Date(invoice.saleDate),
            });

            for (let position of this.invoice.positions) {
              (<FormArray>this.invoiceForm.get('positions')).push(
                this.formBuilder.group({
                  'id': [position.id],
                  'invoiceId': [position.invoiceId],
                  'productId': [position.productId],
                  'name': [position.name, Validators.required],
                  'unitOfMeasure': [position.unitOfMeasure, Validators.required],
                  'quantity': [position.quantity, Validators.required],
                  'priceNetto': [position.priceNetto, Validators.required],
                  'totalPriceNetto': [position.totalPriceNetto, Validators.required],
                  'totalPriceBrutto': [position.totalPriceBrutto, Validators.required],
                  'tax': [position.tax, Validators.required],
                  'totalPriceTax': [position.totalPriceTax, Validators.required],
                  'pkwiuCode': [position.pkwiuCode]
                })
              );
            }

            this.sellerDetailsDTO = invoice.seller;
            this.sellerDetails = true;
            this.displayPKWiUCode = invoice.showPKWIUCode;
            console.log('form after get', this.invoiceForm);
          }
        );
    } else {
      this.addPosition();
      this.onIssueDateChange(this.bsValue);
    }
  }

  onSubmit() {
    this.isSubmitting = true;
    this.invoice = this.invoiceForm.value;

    for (let i = 0; i < this.invoice.positions.length; ++i) {
      this.invoice.positions[i].totalPriceNetto = parseFloat(String(this.invoice.positions[i].totalPriceNetto).replace(/,/g, '.'));
      this.invoice.positions[i].totalPriceBrutto = parseFloat(String(this.invoice.positions[i].totalPriceBrutto).replace(/,/g, '.'));
      this.invoice.positions[i].totalPriceTax = parseFloat(String(this.invoice.positions[i].totalPriceTax).replace(/,/g, '.'));
      this.invoice.positions[i].priceNetto = parseFloat(String(this.invoice.positions[i].priceNetto).replace(/,/g, '.'));
    }

    this.invoice.priceGross = parseFloat(String(this.invoice.priceGross).replace(/,/g, '.'));
    this.invoice.priceNet = parseFloat(String(this.invoice.priceNet).replace(/,/g, '.'));
    this.invoice.priceTax = parseFloat(String(this.invoice.priceTax).replace(/,/g, '.'));

    const issueDate: Date = this.invoiceForm.controls['issueDate'].value;
    const saleDate: Date = this.invoiceForm.controls['saleDate'].value;
    this.invoice.issueDate = issueDate.toJSON();
    // formatDate(this.invoiceForm.value.issueDate, 'shortDate', 'en-US');
    this.invoice.saleDate = saleDate.toJSON();


    console.log(this.invoice);

    if (this.editMode) {
      this.invoiceService.updateInvoice(this.id, this.invoice)
        .pipe(finalize(
          () => {
            this.isSubmitting = false;
          }
        ))
        .subscribe();
      console.log('updating...');

    } else {
      this.invoiceService.createInvoice(this.invoice)
        .pipe(finalize(
          () => {
            this.isSubmitting = false;
          }
        ))
        .subscribe(
          res => {
            console.log(res);
          },
          (error: HttpErrorResponse) => {
            if (error.error.errorField === 'number') {
              this.invoiceForm.controls['number'].setErrors({exists: true});
            }
          });
    }
  }

  newPersonFormGroup() {
    return new FormGroup({
      'id': new FormControl(null),
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
          'productId': [null],
          'name': [null, Validators.required],
          'unitOfMeasure': [null, Validators.required],
          'quantity': [1, Validators.required],
          'priceNetto': [null, Validators.required],
          'totalPriceNetto': [null, Validators.required],
          'totalPriceBrutto': [null, Validators.required],
          'tax': [tax, Validators.required],
          'totalPriceTax': [null, Validators.required],
          'pkwiuCode': [null]
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
      totalPriceNetto: this.calculate(1, 0, String(product.priceNetto)),
      totalPriceBrutto: this.calculate(1, +product.tax, String(product.priceNetto)),
      totalPriceTax: this.calculatePriceTax(1, +product.tax, String(product.priceNetto)),
      pkwiuCode: product.pkwiuCode
    });
    this.calculateSummary();
  }

  setClient(id: number, client: Client) {
    this.invoiceForm.get('buyer').patchValue(client);
    this.invoiceForm.get('buyer').patchValue({
      id: id
    });
  }

  assignClientsCopy() {
    this.filteredClients = Object.assign([], this.clients);
  }

  onSelectClient(client: Client) {
    this.clientService.getClient(client.id).subscribe(
      buyer => this.setClient(client.id, <Client>buyer)
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
      totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
    });
    this.calculateSummary();
  }

  onTotalPriceNettoChange(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value;
    let tax = position.get('tax').value;
    if (String(tax) === 'zw') {
      tax = 0;
    }
    const totalPriceNetto = position.get('totalPriceNetto').value;
    const priceNetto = totalPriceNetto / quantity;
    position.patchValue({
      priceNetto: priceNetto,
      totalPriceBrutto: this.calculate(+quantity, +tax, String(priceNetto)),
      totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
    });
    this.calculateSummary();
  }

  onTotalPriceBruttoChange(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value;
    let tax = position.get('tax').value;
    if (String(tax) === 'zw') {
      tax = 0;
    }
    let totalPriceBrutto = position.get('totalPriceBrutto').value;
    try {
      totalPriceBrutto = totalPriceBrutto.replace(/,/g, '.');
      totalPriceBrutto = parseFloat(totalPriceBrutto);
    } catch (e) {
      console.error('totalPriceBrutto', 'not price');
    }
    const priceNetto = ((totalPriceBrutto / quantity) * 100 / (tax + 100)).toFixed(2).replace(/\./g, ',');
    position.patchValue({
      priceNetto: priceNetto,
      totalPriceNetto: this.calculate(+quantity, 0, String(priceNetto)),
      totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
    });
    this.calculateSummary();
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

    return (((priceNetto * tax) / 100) * quantity).toFixed(2);
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
      priceNet: priceNet.toFixed(2).replace(/\./g, ','),
      priceTax: priceTax.toFixed(2).replace(/\./g, ','),
      priceGross: priceGross.toFixed(2).replace(/\./g, ',')
    });

  }

  onIssueDateChange(date: Date) {
    if (!this.editMode) {
      this.invoiceService.getNextInvoiceNumber(date.toJSON())
        .pipe(
          finalize(() => {
            this.invoiceForm.patchValue({
              number: this.invoiceNumber
            });
          })
        )
        .subscribe(
          (resp: InvoiceNextNumberDTO) => {
            this.invoiceNumber = resp.number;
          }
        );
    }
  }

  onPKWiUChange() {
    this.displayPKWiUCode = this.invoiceForm.controls['showPKWIUCode'].value;
    console.log('displayPKWiUCode', this.displayPKWiUCode);
  }
}
