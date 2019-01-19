import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClientService } from '../../clients/client.service';
import { InvoiceService } from '../invoice.service';
import { finalize } from 'rxjs/operators';
import { Client } from '../../models/client.model';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { plLocale } from 'ngx-bootstrap/locale';
import { ProductService } from '../../products/product.service';
import { UserService } from '../../users/user.service';
import { AppUserDetailsDTO } from '../../models/dto/users/app-user-details-dto';
import { ProductDetailsDTO } from '../../models/dto/products/product-details-dto';
import { InvoiceDTO } from '../../models/dto/invoice/invoice-dto';
import { InvoiceNextNumberDTO } from '../../models/dto/invoice/invoice-next-number-dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ToastrService } from 'ngx-toastr';
import { InvoiceCreateResponseDTO } from '../../models/dto/invoice/invoice-create-response-dto';

@Component({
  selector: 'app-invoice-edit',
  templateUrl: './invoice-edit.component.html',
  styleUrls: ['./invoice-edit.component.css']
})
export class InvoiceEditComponent implements OnInit {
  asyncSelected: string;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;
  dataSource: Observable<any>;

  products: ProductDetailsDTO[];
  clients: Client[];
  vatValues = [23, 8, 7, 5, 0, 'zw'];
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
              private toastr: ToastrService,
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
        });

    this.clientService.getClients()
      .subscribe(
        (clients: Client[]) => {
          this.clients = clients;
        });

    this.route.queryParams.subscribe(
      params => {
        this.clientID = +params.client;
      }
    );

    this.route.params
      .subscribe(
        (prams: Params) => {
          const url: string = this.router.url;

          this.id = +prams['id'];
          this.editMode = prams['id'] != null;

          this.formInit();

          if (url.match('/new')) {
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

                  if (this.clientID) {
                    this.clientService.getClient(this.clientID)
                      .subscribe(
                        client => {
                          this.client = client;
                          this.client.id = this.clientID;
                          console.log('client', client);
                          console.log('buyer', this.invoice.buyer);
                          this.invoice.buyer = this.client;
                          this.invoiceForm.get('buyer').patchValue(this.client);
                        }
                      );
                  }
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
              priceTax: invoice.priceTax.toLocaleString('pl'),
              priceGross: invoice.priceGross.toLocaleString('pl'),
              priceNet: invoice.priceNet.toLocaleString('pl'),
            });

            for (let position of this.invoice.positions) {
              (<FormArray>this.invoiceForm.get('positions')).push(
                this.formBuilder.group({
                  'id': [position.id],
                  'invoiceId': [position.invoiceId],
                  'productId': [position.productId],
                  'ordinalNumber': [position.ordinalNumber],
                  'name': [position.name, Validators.required],
                  'unitOfMeasure': [position.unitOfMeasure, Validators.required],
                  'quantity': [position.quantity, Validators.required],
                  'priceNetto': [position.priceNetto.toFixed(2).replace('\.', ','), Validators.required],
                  'totalPriceNetto': [position.totalPriceNetto.toFixed(2).replace('\.', ','), Validators.required],
                  'totalPriceBrutto': [position.totalPriceBrutto.toFixed(2).replace('\.', ','), Validators.required],
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

    if (this.invoice.positions.length !== 0) {
      for (let i = 0; i < this.invoice.positions.length; ++i) {
        this.invoice.positions[i].totalPriceNetto = parseFloat(String(this.invoice.positions[i].totalPriceNetto).replace(/,/g, '.'));
        this.invoice.positions[i].totalPriceBrutto = parseFloat(String(this.invoice.positions[i].totalPriceBrutto).replace(/,/g, '.'));
        this.invoice.positions[i].totalPriceTax = parseFloat(String(this.invoice.positions[i].totalPriceTax).replace(/,/g, '.'));
        this.invoice.positions[i].priceNetto = parseFloat(String(this.invoice.positions[i].priceNetto).replace(/,/g, '.'));
        this.invoice.positions[i].quantity = parseFloat(String(this.invoice.positions[i].quantity).replace(/,/g, '.'));
        this.invoice.positions[i].ordinalNumber = i + 1;
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
        console.log('updating...');
        this.invoiceService.updateInvoice(this.id, this.invoice)
          .pipe(finalize(
            () => {
              this.isSubmitting = false;
            }
          ))
          .subscribe(
            res => {
              console.log('updated', res);
              this.toastr.success('Faktura została pomyślnie zaktualizowana', 'Sukces');
              this.router.navigate(['/', 'invoices', this.id]);
            },
            (error: HttpErrorResponse) => {
              if (error.error.errorField === 'number') {
                this.invoiceForm.controls['number'].setErrors({exists: true});
              }
              this.toastr.error('Błąd');
            }
          );
      } else {
        this.invoiceService.createInvoice(this.invoice)
          .pipe(finalize(
            () => {
              this.isSubmitting = false;
            }
          ))
          .subscribe(
            (res: InvoiceCreateResponseDTO) => {
              console.log(res);
              this.toastr.success('Faktura została pomyślnie utworzona', 'Sukces');
              this.router.navigate(['/', 'invoices', res.id]);
            },
            (error: HttpErrorResponse) => {
              if (error.error.errorField === 'number') {
                this.invoiceForm.controls['number'].setErrors({exists: true});
              }
              this.toastr.error('Błąd');
            }
          );
      }
    } else {
      this.isSubmitting = false;
      this.toastr.error('Faktura musi posiadać co najmniej jedną pozycję', 'Pozycje faktury',);
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

  addPosition() {
    const tax = 23;
    (<FormArray>this.invoiceForm.get('positions')).push(
      this.formBuilder.group({
          'productId': [null],
          'name': [null, Validators.required],
          'ordinalNumber': [null],
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

  onDeletePosition(i: number) {
    if (confirm(`Czy na pewno chcesz usnąć?`)) {
      (<FormArray>this.invoiceForm.get('positions')).removeAt(i);
      this.calculateSummary();
    }
  }

  onSelectProduct(i: number, e: TypeaheadMatch): void {
    console.log('Selected value: ', e.item);
    const product = e.item;
    let tax;
    if (product.tax === 'zw') {
      tax = 0;
    } else {
      tax = product.tax;
    }
    (<FormArray>this.invoiceForm.get('positions')).at(i).patchValue({
      productId: product.id,
      name: product.name,
      unitOfMeasure: product.unitOfMeasure,
      priceNetto: product.priceNetto,
      tax: product.tax,
      totalPriceNetto: this.calculate(1, 0, String(product.priceNetto)),
      totalPriceBrutto: this.calculate(1, +tax, String(product.priceNetto)),
      totalPriceTax: this.calculatePriceTax(1, +tax, String(product.priceNetto)),
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

  onSelectClient(e: TypeaheadMatch) {
    const client = e.item;
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

  onChangeCalculate(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value.toString().replace(',', '\.');
    if (!isNaN(quantity)) {
      if (quantity > 0) {
        let tax = position.get('tax').value;
        if (String(tax) === 'zw') {
          tax = 0;
        }
        const priceNetto = position.get('priceNetto').value.toString().replace(',', '\.');
        console.log(priceNetto);
        if (!isNaN(priceNetto)) {
          if (priceNetto !== '' && priceNetto !== null) {
            position.patchValue({
              totalPriceNetto: this.calculate(+quantity, 0, String(priceNetto)),
              totalPriceBrutto: this.calculate(+quantity, +tax, String(priceNetto)),
              totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
            });
            this.calculateSummary();
          }
        } else {
          position.patchValue({'priceNetto': null});
          this.toastr.info('Cena netto musi być liczbą');
        }
      } else {
        position.patchValue({'quantity': null});
        this.toastr.info('Ilość nie może być mniejsz niż 0');
      }
    } else {
      position.patchValue({'quantity': null});
      this.toastr.info('Ilość musi być liczbą');
    }
  }

  onTotalPriceNettoChange(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value.toString().replace(',', '\.');
    let tax = position.get('tax').value;
    if (String(tax) === 'zw') {
      tax = 0;
    }
    const totalPriceNetto = position.get('totalPriceNetto').value.toString().replace(',', '\.');
    if (!isNaN(totalPriceNetto)) {
      const priceNetto = totalPriceNetto / quantity;
      position.patchValue({
        priceNetto: priceNetto.toString().replace('\.', ','),
        totalPriceBrutto: this.calculate(+quantity, +tax, String(priceNetto)),
        totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
      });
      this.calculateSummary();
    } else {
      position.patchValue({'totalPriceNetto': null});
      this.toastr.info('Wartość netto musi być liczbą');
    }
  }

  onTotalPriceBruttoChange(i: number) {
    const position = (<FormArray>this.invoiceForm.get('positions')).at(i);
    const quantity = position.get('quantity').value.toString().replace(',', '\.');
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
    if (!isNaN(totalPriceBrutto)) {
      const priceNetto = ((totalPriceBrutto / quantity) / (+tax / 100 + 1)).toFixed(2);
      position.patchValue({
        priceNetto: priceNetto.replace('\.', ','),
        totalPriceNetto: this.calculate(+quantity, 0, String(priceNetto)),
        totalPriceTax: this.calculatePriceTax(+quantity, +tax, String(priceNetto))
      });
      this.calculateSummary();
    } else {
      position.patchValue({'totalPriceBrutto': null});
      this.toastr.info('Wartość netto musi być liczbą');
    }
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
