import { BaseModel } from "../base.model";

export class UserFilter extends BaseModel {
  filter?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  siginWith?: string;
  type?: string;
  birthDate?: string;
  profileImgUrl?: string;
  videoId?: number;

  constructor(j?: any) {
    super(j);
    if (j) {
      this.filter = j.filter;
      this.firstName = j.firstName;
      this.lastName = j.lastName;
      this.email = j.email;
      this.siginWith = j.siginWith;
      this.type = j.type;
      this.birthDate = j.birthDate;
      this.profileImgUrl = j.profileImgUrl;
      this.videoId = j.videoId;
    }
  }
}
