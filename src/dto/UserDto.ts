export class UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number;
  devices: any[];
  createdAt: Date;

  constructor(user: any) {
    this.id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.balance = user.balance;
    this.devices = user.devices;
    this.createdAt = user.createdAt;
  }
}

export class AuthResponseDTO {
  user: UserDTO;
  token: string;
  deviceVerified: boolean;

  constructor(user: any, token: string, deviceVerified: boolean) {
    this.user = new UserDTO(user);
    this.token = token;
    this.deviceVerified = deviceVerified;
  }
}