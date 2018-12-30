import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoices;
  private filename: string;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.invoices = this.invoiceService.getInvoices();
    //   .subscribe(
    //   (invoiceListDTO: InvoiceListDTO[]) => { this.invoices = invoiceListDTO; }
    // );
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
    this.invoiceService.getInvoicePdf(id)
      .subscribe(response => {
        const blob = new Blob([response.content], {type: 'application/pdf'});
            saveAs(blob, response.fileName);
      });
  }
}
