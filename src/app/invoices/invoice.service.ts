import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Invoice } from './invoice.model';
import { Subject } from 'rxjs';
import { InvoiceDTO } from '../models/dto/invoice/invoice-dto';
import { map } from 'rxjs/operators';

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

  getInvoicePdf(invoiceId: number) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    return this.httpClient.get(`${this.apiEndpoint}/${invoiceId}/pdf`, { responseType: 'blob', observe: 'response' })
      .pipe(map(res => ({content: res.body,
        fileName: res.headers.get('Content-Filename')})
      ));
  }

  createInvoice(invoice: InvoiceDTO) {
    return this.httpClient.post(this.apiEndpoint, invoice);
  }

  updateInvoice(id: number, invoice: InvoiceDTO) {
    return this.httpClient.put(`${this.apiEndpoint}/${id}`, invoice);
  }

  deleteInvoice(invoiceId: number) {
    const req = this.httpClient.delete(`${this.apiEndpoint}/${invoiceId}`);
    this.invoiceListChanged.next();
    return req;
  }

  getNextInvoiceNumber(issueDate: string) {
    return this.httpClient.get(`${this.apiEndpoint}/next-number`, {params: new HttpParams().set('issueDate', issueDate)});
  }
}
