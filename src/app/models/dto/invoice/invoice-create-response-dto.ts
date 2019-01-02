import { AppUserDetailsDTO } from '../users/app-user-details-dto';
import { ClientDTO } from '../clients/client-dto';
import { InvoicePositionDTO } from './invoice-position-dto';

export class InvoiceCreateResponseDTO {
  id: number;
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
