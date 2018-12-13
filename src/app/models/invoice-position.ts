import { Product } from '../products/product.model';

export class InvoicePosition {
  id: number;
  product: Product;
  quantity: number;
  nettoValue: string;
  bruttoValue: string;
  totalTaxValue: string;
}
