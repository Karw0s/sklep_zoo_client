import { Invoice } from './invoice.model';

export const INVOICES: Invoice[] = [
  {
    id: 1,
    number: '1/12/2018',
    saleDate: '1.12.2018',
    issuePlace: 'Warszawa',
    issueDate: '1.12.2018',
    paymentType: 'gotówka',
    priceNet: 100.00,
    priceGross: 123.00,
    seller: {
      id: 1,
      companyName: 'Helion sp Zoo',
      nipNumber: 5272526138,
      address: {
        id: 1,
        street: 'Piaskowa 4',
        zipCode: '03-067',
        city: 'Warszawa',
        country: 'Polska'
      },
      firstName: 'Jan',
      lastName: 'Kowalski'
    },
    buyer: {
      id: 2,
      companyName: 'MarekBudex',
      nipNumber: 5272526100,
      address: {
        id: 1,
        street: 'Piaskowa 45',
        zipCode: '03-063',
        city: 'Warszawa',
        country: 'Polska'
      },
      firstName: 'Marek',
      lastName: 'Budowniczy'
    },
    positions: [
      {
        id: 1,
        product: {
          id: 1,
          catalogNumber: '1233',
          name: 'Purina Adult',
          manufacturer: 'Purina',
          unitOfMeasure: 'szt',
          amount: 12,
          priceNetto: '100,00',
          priceBrutto: '123,00',
          tax: 23,
          pkiwCode: '12333-12333'
        },
        quantity: 1,
        nettoValue: '100',
        totalTaxValue: '23',
        bruttoValue: '123',
      },
      {
        id: 2,
        product: {
          id: 2,
          catalogNumber: '1233',
          name: 'Purina Junior',
          manufacturer: 'Purina',
          unitOfMeasure: 'szt',
          amount: 12,
          priceNetto: '100,00',
          priceBrutto: '123,00',
          tax: 23,
          pkiwCode: '12333-12333'
        },
        quantity: 1,
        nettoValue: '100',
        totalTaxValue: '23',
        bruttoValue: '123',
      }
    ],

  }
];
