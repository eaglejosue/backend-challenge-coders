import { HttpClient } from "../httpClient";
import { LoginRequest } from "../../models/login.request";
import { ResetPasswordRequest } from "../../models/resetPassword.request";

export class LoginService {
  private endpoint = "/login";
  private _httpClient!: HttpClient;

  constructor() {
    this._httpClient = new HttpClient();
  }

  public async googleUserInfo(token: string) {
    const response = await this._httpClient.get<any>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }

  public async login(data: LoginRequest) {
    const response = await this._httpClient.post<string>(
      this.endpoint, { data }
    );
    return response.data;
  }

  public async sigin(data: LoginRequest) {
    const response = await this._httpClient.post<string>(
      '/sigin', { data }
    );
    return response.data;
  }

  public async activate(code: string) {
    const response = await this._httpClient.post<string>(
      `${this.endpoint}/activate/${code}`
    );
    return response.data;
  }

  public async forgotPassword(email: string) {
    const response = await this._httpClient.post<string>(
      `${this.endpoint}/forgot-password/${email}`
    );
    return response.data;
  }

  public async checkResetPassword(code: string) {
    const response = await this._httpClient.post<string>(
      `${this.endpoint}/check-reset-password-code/${code}`
    );
    return response.data;
  }

  public async resetPassword(data: ResetPasswordRequest) {
    const response = await this._httpClient.post<string>(
      `${this.endpoint}/reset-password`, { data }
    );
    return response.data;
  }
}

export default new LoginService();
