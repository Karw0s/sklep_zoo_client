import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Invoice } from './invoice.model';
import { INVOICES } from './invoice.mock';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private authService: AuthService,
              private httpClient: HttpClient) { }


  getInvoices() {
    return INVOICES;
  }

  getInvoice(invoiceNumber: string) {
    return INVOICES[0];
  }

  createInvoice(invoice: Invoice) {}
}
