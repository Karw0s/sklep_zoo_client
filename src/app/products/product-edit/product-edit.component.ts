import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  productForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (prams: Params) => {
        this.id = +prams['id'];
        this.editMode = prams['id'] != null;
        this.initForm();
      }
    );
  }

  private initForm() {
    let productName = '';
    let productPrice = '';
    let productDescription = '';
    // let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const product = this.productService.getProduct(this.id);
      productName = product.name;
      productPrice = product.price;
      productDescription = product.description;
      // if (recipe['ingredients']) {
      //   for (let ingredient of recipe.ingredients) {
      //     recipeIngredients.push(
      //       new FormGroup({
      //         'name': new FormControl(ingredient.name, Validators.required),
      //         'amount': new FormControl(ingredient.amount, [
      //           Validators.required,
      //           Validators.pattern(/^[1-9]+[0-9]*$/)
      //         ])
      //       })
      //     );
      //   }
      // }
    }
    this.productForm = new FormGroup({
      'name': new FormControl(productName, Validators.required),
      'price': new FormControl(productPrice, Validators.required),
      'description': new FormControl(productDescription, Validators.required),
      // 'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.productForm.value['name'],
    //   this.productForm.value['description'],
    //   this.productForm.value['imagePath'],
    //   this.productForm.value['ingredients']);
    console.log(this.productForm.value);
    if (this.editMode) {
      this.productService.updateProduct(this.id, this.productForm.value);
    } else {
      this.productService.addProduct(this.productForm.value);
    }
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  getControls() {
    return (<FormArray>this.productForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.productForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngerdient(index: number) {
    (<FormArray>this.productForm.get('ingredients')).removeAt(index);
  }

}
