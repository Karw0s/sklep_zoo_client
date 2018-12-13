import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { HttpEvent } from '@angular/common/http';
import { Product } from '../product.model';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  private id: number;
  private editMode = false;
  private hasProduct = false;
  private product: Product;
  productForm: FormGroup;
  vatValues = [23, 8, 5, 3];
  unitsOfMeasure = ['szt', 'kg'];

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit() {

    this.route.params.subscribe(
      (prams: Params) => {
        const url: string = this.router.url;

        this.id = +prams['id'];
        this.hasProduct = prams['id'] != null;
        this.editMode = url.endsWith('edit');

        if (url.match('/new/')) {
          this.editMode = true;
        }

        this.initForm();

        if (this.hasProduct) {
          this.productService.getProduct(this.id).pipe(
            tap(prod => {
              this.productForm.patchValue(prod);
            })
          ).subscribe(
            prod => { this.product = prod; }
          );
        }
      }
    );

  }

  private initForm() {
    let catalogNumber = '';
    let productName = '';
    let productManufacturer = '';
    let units = 'szt';
    let amount = 0;
    let priceNetto = '';
    let priceBrutto = '';
    let vat = 23;
    let pkiwCode = '';


    this.productForm = new FormGroup({
      'id': new FormControl(null),
      'catalogNumber': new FormControl(catalogNumber, Validators.required),
      'name': new FormControl(productName, Validators.required),
      'manufacturer': new FormControl(productManufacturer, Validators.required),
      'unitOfMeasure': new FormControl(units, Validators.required),
      'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*(,[0-9]{2})?$/)]),
      'priceNetto': new FormControl(priceNetto, [
        Validators.required,
        // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      'priceBrutto': new FormControl(priceBrutto, [
        Validators.required,
        // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      'vat': new FormControl(vat, [Validators.required]),
      'pkiwCode': new FormControl(pkiwCode, [Validators.required])

    });
    if (!this.editMode) {
      this.productForm.get('vat').disable();
      this.productForm.get('unitOfMeasure').disable();
    }
  }

  onSubmit() {
    const product = this.productForm.value;
    // product.priceNetto = parseFloat(this.productForm.value['priceNetto'].replace(/,/g, '.')).toFixed(2);
    // product.priceBrutto = parseFloat(this.productForm.value['priceBrutto'].replace(/,/g, '.')).toFixed(2);
    if (!this.hasProduct) {
      this.productService.addProduct(product)
        .subscribe(
          (response: HttpEvent<Object>) => {
            console.log(response);
          }
        );
    } else {
      this.productService.updateProduct(this.id, product)
        .pipe(tap(
          product => { this.productForm.patchValue(product); }
        ))
        .subscribe(
          (product2: Product) => {
            this.product = product2;
            this.router.navigate(['../'], {relativeTo: this.route});
          }
        );
    }
    //
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCalculateBruttoPrice() {
    const priceNetto = parseFloat(this.productForm.value['priceNetto'].replace(/,/g, '.'));
    const vat = +this.productForm.value['vat'];
    const newvalue = parseFloat(String(priceNetto + ((priceNetto * vat) / 100))).toFixed(2).replace(/\./g, ',');

    this.productForm.patchValue({'priceBrutto': newvalue});
  }

}
