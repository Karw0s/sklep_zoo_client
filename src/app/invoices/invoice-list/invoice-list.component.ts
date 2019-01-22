import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { InvoiceListDTO } from '../../models/dto/invoice/invoice-list-dto';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoices;
  isLoading = false;
  private returnedArray: InvoiceListDTO[];
  private contentArray: InvoiceListDTO[];
  searchString: any;

  constructor(private invoiceService: InvoiceService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.isLoading = true;
    this.invoices = this.invoiceService.getInvoices()
      .pipe(finalize(
        () => this.isLoading = false
      ))
      .subscribe(
        (invoiceListDTO: InvoiceListDTO[]) => {
          this.invoices = invoiceListDTO;
          this.contentArray = invoiceListDTO;
          this.returnedArray = this.contentArray.slice(0, 10);
        },
        error => {
          this.toastr.error('Nie można załadować listy', 'Błąd servera');
        }
      );
  }

  deleteInvoice(id: number, i: number) {
    if (confirm(`Czy na pewno chcesz usnąć fakture?`)) {
      this.invoiceService.deleteInvoice(id)
        .subscribe(
          res => {
            this.invoiceService.getInvoices()
              .subscribe(
                response => this.invoices = response
              );
            this.toastr.success('Usunięto');
          }
        );
    }
  }

  onInvoicePdf(id: number) {
    this.invoiceService.getInvoicePdf(id, true)
      .subscribe(response => {
        const blob = new Blob([response.content], {type: 'application/pdf'});
        saveAs(blob, response.fileName);
      });
  }
}
