export class LoginRequest {
  email?: string = "";
  password?: string = "";
  signInWith?: string = "Default";
  firstName?: string = "";
  lastName?: string = "";
  birthDate?: string = "";
  profileImgUrl?: string = "";

  constructor(o: any) {
    if (o) {
      this.email = o.email ?? "";
      this.password = o.password ?? "";
      this.signInWith = o.signInWith ?? "Default"
      this.firstName = o.firstName ?? "";
      this.lastName = o.lastName ?? "";
      this.birthDate = o.birthDate ?? "";
      this.profileImgUrl = o.profileImgUrl ?? "";
    }
  }
}
