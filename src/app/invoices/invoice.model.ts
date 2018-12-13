import { Client } from '../models/client';

export class Invoice {
  number: string;
  saleDate: string;
  issueDate: string;
  paymentType: string;
  client: Client;
  buyer: Client;
  positions: InsertPosition[];

}
