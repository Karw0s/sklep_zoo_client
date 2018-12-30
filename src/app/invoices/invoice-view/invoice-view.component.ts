import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  private id: number;
  private invoicePdf;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private invoiceService: InvoiceService) { }

  ngOnInit() {

    this.route.params
      .pipe(finalize(
        () => this.invoicePdf = this.invoiceService.getInvoicePdf(this.id, false)
      ))
      .subscribe(
        (prams: Params) => {
          this.id = +prams['id'];
        }
      );
  }

}
