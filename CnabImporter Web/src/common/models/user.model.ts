import { BaseModel } from "./base.model";

export class UserModel extends BaseModel {
  type!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  cpf!: string;
  signInWith!: string;
  birthDate?: string;
  profileImgUrl?: string;
  acceptedTermsAt?: string;

  oldPassword?: string;
  password?: string;
  fullname!: string;

  constructor(j?: any) {
    super(j);
    if (j) {
      this.type = j.type;
      this.firstName = j.firstName;
      this.lastName = j.lastName;
      this.email = j.email;
      this.cpf = j.cpf;
      this.signInWith = j.signInWith;
      this.birthDate = j.birthDate;
      this.profileImgUrl = j.profileImgUrl;
      this.acceptedTermsAt = j.acceptedTermsAt;

      this.oldPassword = j.oldPassword;
      this.password = j.password;
      this.fullname = j.fullname;
      this.updatedBy = j.updatedBy;
    }
  }
}
