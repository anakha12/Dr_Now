export class AdminLoginDTO {
  email: string;
  password: string;

  constructor(data: any) {
    this.email = data.email;
    this.password = data.password;
  }
}
