import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { HttpEvent } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { tap } from 'rxjs/operators';
import { ProductDTO } from '../../models/dto/products/product-dto';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  private id: number;
  editMode = false;
  private hasProduct = false;
  private product: ProductDTO;
  productForm: FormGroup;
  vatValues = [23, 8, 7, 5, 0, 'zw'];
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
              this.fixPrices();
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
    let tax = 23;
    let pkwiuCode = '';


    this.productForm = new FormGroup({
      'catalogNumber': new FormControl(catalogNumber),
      'name': new FormControl(productName, Validators.required),
      'manufacturer': new FormControl(productManufacturer, Validators.required),
      'unitOfMeasure': new FormControl(units, Validators.required),
      'amount': new FormControl(amount, [Validators.required, Validators.pattern(/^(([1-9]+[0-9]*)|0)(,[0-9]{2})?$/)]),
      'priceNetto': new FormControl(priceNetto, [
        Validators.required,
        // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      'priceBrutto': new FormControl(priceBrutto, [
        Validators.required,
        // Validators.pattern(/^[1-9]+[0-9]*,[0-9]{2}$/)
      ]),
      'tax': new FormControl(tax, [Validators.required]),
      'pkwiuCode': new FormControl(pkwiuCode),
      'barCode': new FormControl('')

    });
    if (!this.editMode) {
      this.productForm.get('tax').disable();
      this.productForm.get('unitOfMeasure').disable();
    }
  }

  onSubmit() {
    const product = this.productForm.value;
    try {
      product.priceNetto = parseFloat(this.productForm.value['priceNetto'].replace(/,/g, '.')).toFixed(2);
    } catch (e) {
      product.priceNetto = parseFloat(this.productForm.value['priceNetto']).toFixed(2);
    }
    try {
      product.priceBrutto = parseFloat(this.productForm.value['priceBrutto'].replace(/,/g, '.')).toFixed(2);
    } catch (e) {
      product.priceBrutto = parseFloat(this.productForm.value['priceBrutto']).toFixed(2);
    }

    if (!this.hasProduct) {
      this.productService.addProduct(product)
        .subscribe(
          (response: HttpEvent<Object>) => {
            console.log(response);
            this.router.navigate(['../'], {relativeTo: this.route});
          }
        );
    } else {
      this.productService.updateProduct(this.id, product)
        .pipe(tap(
          product => { this.productForm.patchValue(product); console.log(product); }
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

  onDelete() {
    if (confirm('Czy na pewno chcesz usnąć ten produkt?')) {
      this.productService.deleteProduct(this.id);
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  onCalculateBruttoPrice() {
    let nett = this.productForm.value['priceNetto'];
    let priceNetto = 0;
    try {
      nett = nett.replace(/,/g, '.');
      priceNetto = parseFloat(nett);
    } catch (e) {
      priceNetto = nett;
    }
    let tax;
    if (this.productForm.value['tax'] === 'zw') {
      tax = 0;
    } else {
      tax = +this.productForm.value['tax'];
    }
    const newvalue = parseFloat(String(priceNetto + ((priceNetto * tax) / 100))).toFixed(2).replace(/\./g, ',');

    this.productForm.patchValue({'priceBrutto': newvalue});
  }

  fixPrices() {
    let nett = this.productForm.value['priceNetto'];
    let gross = this.productForm.value['priceBrutto'];

    nett = parseFloat(nett).toFixed(2);
    nett = nett.toString().replace(/\./g, ',');
    gross = parseFloat(gross).toFixed(2);
    gross = gross.toString().replace(/\./g, ',');

    this.productForm.patchValue({'priceNetto': nett});
    this.productForm.patchValue({'priceBrutto': gross});
  }
}
