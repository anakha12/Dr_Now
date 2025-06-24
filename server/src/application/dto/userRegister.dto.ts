export class UserRegisterDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  age: string;
  gender: string;
  dateOfBirth: Date;
  address: string;
  bloodGroup: string;
  image?: string;
  isDonner?: boolean | string;

  constructor(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.age = data.age;
    this.gender = data.gender;
    this.dateOfBirth = data.dateOfBirth;
    this.address = data.address;
    this.bloodGroup = data.bloodGroup;
    this.image = data.image;
    this.isDonner = data.isDonner; 
  }
}