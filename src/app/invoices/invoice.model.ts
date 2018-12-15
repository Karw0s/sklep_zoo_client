import { Client } from '../models/client';
import { InvoicePosition } from '../models/invoice-position';

export class Invoice {
  number: string;
  saleDate: string;
  issueDate: string;
  paymentType: string;
  client: Client;
  buyer: Client;
  positions: InvoicePosition[];

}
