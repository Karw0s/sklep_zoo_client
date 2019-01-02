export class InvoiceListDTO {
  id: number;
  number: string;
  issueDate: string;
  paymentType: string;
  buyerCompanyName: string;
  priceNet: number;        // netto
  priceGross: number;      // brutto
}
