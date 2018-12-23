import { AddressDTO } from './addresses/address-dto';

export class AppUserDetailsDTO {

  bank: string;
  bankAccountNumber: string;
  email: string;
  companyName: string;
  nipNumber: number;
  address: AddressDTO;
  firstName: string;
  lastName: string;
}
