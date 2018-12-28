import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { InvoiceListDTO } from '../invoice-list-dto';
import { ActivatedRoute, Router } from '@angular/router';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoices;

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.invoices = this.invoiceService.getInvoices()
    //   .subscribe(
    //   (invoiceListDTO: InvoiceListDTO[]) => { this.invoices = invoiceListDTO; }
    // );
  }

  deleteInvoice(id: number, i: number) {
    if (confirm(`Czy na pewno chcesz usnąć fakture ${this.invoices[i].number}?`)) {
      this.invoiceService.deleteInvoice(id).subscribe(
        res => {
          this.invoices.splice(i, 1);
        }
      );
    }
  }
}
