export class InvoicePositionDTO {
  public id: number;
  public productId: number;
  public invoiceId: number;
  public name: string;
  public pkwiuCode: string;
  public unitOfMeasure: string;
  public quantity: number;
  public priceNetto: number;
  public totalPriceNetto: number;
  public totalPriceBrutto: number;
  public tax: number;
  public totalPriceTax: number;
}
