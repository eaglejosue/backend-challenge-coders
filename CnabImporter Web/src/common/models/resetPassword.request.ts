export class ResetPasswordRequest {
  resetPasswordCode?: string = "";
  newPassword?: string = "";

  constructor(obj: any) {
    if (obj) {
      this.resetPasswordCode = obj.resetPasswordCode;
      this.newPassword = obj.newPassword;
    }
  }
}
