import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceListChanged = new Subject<Invoice>();
  apiEndpoint = 'http://localhost:9000/invoices';

  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }


  getInvoices() {
    return this.httpClient.get(this.apiEndpoint);
  }

  getInvoice(invoiceId: number) {
    return this.httpClient.get(`${this.apiEndpoint}/${invoiceId}`);
  }

  createInvoice(invoice: Invoice) {
    return this.httpClient.post(this.apiEndpoint, invoice);
  }

  updateInvoice(id: number, invoice: Invoice) {
    return this.httpClient.put(`${this.apiEndpoint}/${id}`, invoice);
  }

  deleteInvoice(invoiceId: number) {
    const req = this.httpClient.delete(`${this.apiEndpoint}/${invoiceId}`);
    this.invoiceListChanged.next();
    return req;
  }
}
