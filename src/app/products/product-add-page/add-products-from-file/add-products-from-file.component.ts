import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../product.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-products-from-file',
  templateUrl: './add-products-from-file.component.html',
  styleUrls: ['./add-products-from-file.component.css']
})
export class AddProductsFromFileComponent implements OnInit {

  @ViewChild('labelInput') labelInput: ElementRef;
  fileToUpload: File = null;
  isUploading = false;

  constructor(private productService: ProductService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  onFileChanged(event) {
    if (event.target.files.length !== 0) {
      this.fileToUpload = event.target.files[0];
      this.labelInput.nativeElement.innerText = event.target.files[0].name;
    } else {
      this.fileToUpload = null;
      this.labelInput.nativeElement.innerText = 'Wybierz plik';
    }
  }

  onUpload() {
    if (this.fileToUpload !== null) {
      if (this.fileToUpload.type === 'text/csv' || this.fileToUpload.type === 'application/vnd.ms-excel') {
        this.isUploading = true;
        this.productService.addProductFromCSV(this.fileToUpload)
          .pipe(finalize(
            () => this.isUploading = false
          ))
          .subscribe(
            resp => {
              this.toastr.success('Produkty zostały pomyślnie dodane', 'Sukces');
            },
            error => {
              this.toastr.error('Błąd podczas odczytywania danych z pliku');
            }
          );
      } else {
        this.toastr.error('Wybierz plik w formacie .csv', 'Błędny format pliku');
        this.fileToUpload = null;
        this.labelInput.nativeElement.innerText = 'Wybierz plik';
      }
    }
  }
}
