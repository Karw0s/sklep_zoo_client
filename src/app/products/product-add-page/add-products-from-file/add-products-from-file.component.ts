import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-products-from-file',
  templateUrl: './add-products-from-file.component.html',
  styleUrls: ['./add-products-from-file.component.css']
})
export class AddProductsFromFileComponent implements OnInit {

  fileToUpload: File = null;

  constructor() { }

  ngOnInit() {
  }

  onFileChanged(event) {
    this.fileToUpload = event.target.files[0];
  }

  onUpload() {
    // upload code goes here
    console.log(this.fileToUpload);
  }

  // uploadFileToActivity() {
  //   this.fileUploadService.postFile(this.fileToUpload).subscribe(data => {
  //     // do something, if upload success
  //   }, error => {
  //     console.log(error);
  //   });
  // }

}
