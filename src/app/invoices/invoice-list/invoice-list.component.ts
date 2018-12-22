import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { InvoiceListDTO } from '../invoice-list-dto';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  invoices: InvoiceListDTO[];

  constructor(private invoiceService: InvoiceService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.invoiceService.getInvoices().subscribe(
      (invoiceListDTO: InvoiceListDTO[]) => { this.invoices = invoiceListDTO; }
    );
  }

  deleteInvoice(id: number) {
    if (confirm('Czy na pewno chcesz usnąć fakture?')) {
      this.invoiceService.deleteInvoice(id).subscribe(
        res => {
          console.log(res);
        }
      );
    }
  }
}
