import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice.model';
import { INVOICES } from './invoice.mock';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceListChanged = new Subject<Invoice>();
  apiEndpoint = 'http://localhost:9000';

  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }


  getInvoices() {
    return this.httpClient.get(this.apiEndpoint + '/invoices/list');
  }

  getInvoicesList() {
    return this.httpClient.get(this.apiEndpoint + '/invoices/list');
  }

  getInvoice(invoiceId: number) {
    return this.httpClient.get(this.apiEndpoint + '/invoices/' + invoiceId);
  }

  createInvoice(invoice: Invoice) {
    return this.httpClient.post(this.apiEndpoint + '/invoices', invoice);
  }

  updateInvoice(invoice: Invoice) {
    return this.httpClient.put(this.apiEndpoint + '/invoices/' + invoice.id, invoice);
  }

  deleteInvoice(invoiceId: number) {
    const req = this.httpClient.delete(this.apiEndpoint + '/invoices/' + invoiceId);
    this.invoiceListChanged.next();
    return req;
  }
}
