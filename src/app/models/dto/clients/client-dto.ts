import { AddressDTO } from '../addresses/address-dto';

export class ClientDTO {
  companyName: string;
  nipNumber: number;
  address: AddressDTO;
  firstName: string;
  lastName: string;
}
