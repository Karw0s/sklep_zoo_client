import { AddressDTO } from '../addresses/address-dto';

export class ClientCreateResponseDTO {
  id: number;
  companyName: string;
  nipNumber: number;
  address: AddressDTO;
  firstName: string;
  lastName: string;
}
