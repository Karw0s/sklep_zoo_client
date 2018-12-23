export class InvoicePositionDTO {
  public id: number;
  public productId: number;
  public invoiceId: number;
  public name: string;
  public unitOfMeasure: string;
  public quantity: number;
  public priceNetto: string;
  public priceBrutto: string;
  public totalPriceNetto: string;
  public totalPriceBrutto: string;
  public tax: number;
  public priceTax: number;
  public totalPriceTax: number;
}
