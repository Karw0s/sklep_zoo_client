import { Client } from '../models/client.model';
import { InvoicePosition } from '../models/invoice-position.model';

export class Invoice {
  id: number;
  number: string;
  issueDate: string;
  issuePlace: string;
  saleDate: string;
  paymentType: string;
  seller: Client;
  buyer: Client;
  positions: InvoicePosition[];
  priceNet: number;
  priceGross: number;
  priceTax: number;

}
