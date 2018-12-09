import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  private id: number;
  private editMode = false;
  private hasProduct = false;
  productForm: FormGroup;
  vatValues = [23, 8, 5, 3];

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(
      (prams: Params) => {
        this.id = +prams['id'];
        this.hasProduct = prams['id'] != null;
        const url: string = this.router.url;
        this.editMode = url.endsWith('edit');
        // this.hasPoduct = url.endsWith('edit');
        if (url.match('/new/')) {
          this.editMode = true;
        }
        this.initForm();
      }
    );

  }

  private initForm() {
    let catalogNumber = '';
    let productName = '';
    let productManufacturer = '';
    let amount = 0;
    let priceNetto = '';
    let priceBrutto = '';
    let vat = 0;
    let pkiwCode = '';

    if (this.hasProduct) {
      const product = this.productService.getProduct(this.id);
      catalogNumber = product.catalogNumber;
      productName = product.name;
      productManufacturer = product.manufacturer;
      amount = product.amount;
      priceNetto = product.priceNetto;
      priceBrutto = product.priceBrutto;
      vat = product.vat;
      pkiwCode = product.pkiwCode;
    }


    this.productForm = new FormGroup({
      'catalogNumber': new FormControl(catalogNumber, Validators.required),
      'name': new FormControl(productName, Validators.required),
      'manufacturer': new FormControl(productManufacturer, Validators.required),
      'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'priceNetto': new FormControl(priceNetto, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      'priceBrutto': new FormControl(priceBrutto, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      // 'vat': new FormControl(vat, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'vat': new FormControl(vat, [Validators.required]),
      'pkiwCode': new FormControl(pkiwCode, [Validators.required])

    });
    if (!this.editMode) {
      this.productForm.get('vat').disable();
    }
  }

  onSubmit() {
    console.log(this.productForm.value);
    if (!this.hasProduct) {
      this.productService.addProduct(this.productForm.value);
    } else {
      this.productService.updateProduct(this.id, this.productForm.value);
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCalculateBruttoPrice() {
    const priceNetto = parseFloat(this.productForm.value['priceNetto'].replace(/,/g, '.'));
    const vat = +this.productForm.value['vat'];
    const newvalue = parseFloat(String(priceNetto + ((priceNetto * vat) / 100))).toFixed(2).replace(/\./g, ',');

    this.productForm.patchValue({
      'priceBrutto': newvalue
    });

  }

}
