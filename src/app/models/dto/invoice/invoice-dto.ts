import { InvoicePositionDTO } from './invoice-position-dto';
import { AppUserDetailsDTO } from '../app-user-details-dto';
import { ClientDTO } from '../clients/client-dto';

export class InvoiceDTO {

  number: string;
  issueDate: string;
  issuePlace: string;
  saleDate: string;
  paymentType: string;
  seller: AppUserDetailsDTO;
  buyer: ClientDTO;
  positions: InvoicePositionDTO[];
  priceNet: number;
  priceGross: number;
  priceTax: number;
  showPKWIUCode: boolean;
}
