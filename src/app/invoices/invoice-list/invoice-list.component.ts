import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { finalize, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { InvoiceListDTO } from '../invoice-list-dto';

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
              private router: Router,
              private route: ActivatedRoute) { }

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
        }
      );
  }

  deleteInvoice(id: number, i: number) {
    if (confirm(`Czy na pewno chcesz usnąć fakture?`)) {
      this.invoiceService.deleteInvoice(id)
        .subscribe(
          res => {
            this.invoices = this.invoiceService.getInvoices();
          }
        );
    }
  }

  onInvoicePdf(id: number) {
    this.invoiceService.getInvoicePdf(id, true)
      .subscribe(response => {
        const blob = new Blob([response.content], {type: 'application/pdf'});
        saveAs(blob, response.fileName);
        // const fileURL = URL.createObjectURL(blob);
        // window.open(fileURL, '_blank');
      });
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }
}
