import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { finalize } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  private id: number;
  private invoicePdf;
  isLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.isLoading = true;

    this.route.params
      .pipe(finalize(
        () => this.isLoading = false
      ))
      .subscribe(
        (prams: Params) => {
          this.id = +prams['id'];
          this.invoiceService.getInvoicePdf(this.id, false)
            .subscribe(
              res => {
                const blob = new Blob([res.content], {type: 'application/pdf'});
                this.invoicePdf = URL.createObjectURL(blob);
              }
            );
        }
      );
  }

  onDownloadInvoicePdf(originalPlusCopy: boolean) {
    this.invoiceService.getInvoicePdf(this.id, originalPlusCopy)
      .subscribe(response => {
        const blob = new Blob([response.content], {type: 'application/pdf'});
        saveAs(blob, response.fileName);
      });
  }

}
