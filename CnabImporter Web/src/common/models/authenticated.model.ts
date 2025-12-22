export class AuthenticatedUserModel {
  id!: number;
  type!: number;
  name!: string;
  firstname!: string;
  lastname!: string;
  email!: string;
  profileImgUrl?: string;
  planId!: number;
  lastBookId!: number;
  isValid!: boolean;
  termsAccepted!: boolean;
  token!: string;

  constructor(j?: any) {
    if (j) {
      this.id = j.id;
      this.type = j.type;
      this.name = j.name;
      this.firstname = j.firstname;
      this.lastname = j.lastname;
      this.email = j.email;
      this.profileImgUrl = j.profileImgUrl;
      this.planId = j.planId;
      this.lastBookId = j.lastBookId;
      this.isValid = j.isValid;
      this.termsAccepted = j.termsAccepted;
      this.token = j.token;
    }
  }

  public static fromLocalStorage(): AuthenticatedUserModel | null {
    const userData = localStorage.getItem("user");
    return userData ? new AuthenticatedUserModel(JSON.parse(userData)) : null;
  }

  public static saveToLocalStorage(user: AuthenticatedUserModel) {
    const userData = JSON.stringify(user);
    localStorage.setItem("user", userData);
  }

  public static updateLocalStorage(user: AuthenticatedUserModel) {
    this.removeLocalStorage();
    this.saveToLocalStorage(user);
  }

  public static removeLocalStorage() {
    localStorage.removeItem("user");
  }
}