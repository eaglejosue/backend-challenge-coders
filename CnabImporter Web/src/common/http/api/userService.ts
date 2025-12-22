import queryString from 'query-string';
import { HttpClient } from "../httpClient";
import { UserModel } from '../../models/user.model';
import { UserFilter } from '../../models/filters/user.filter';
import { UserBookLogModel } from '../../models/user-book-log.model';

export class UserService {
  private endpoint = "/users";
  private _httpClient!: HttpClient;

  constructor() {
    this._httpClient = new HttpClient();
  }

  public async getById(id: number) {
    const response = await this._httpClient.get<string>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  public async getAll(filter: UserFilter) {
    const response = await this._httpClient.get<string>(
      `${this.endpoint}?${queryString.stringify(filter)}`
    );
    return response.data;
  }

  public async post(data: UserModel) {
    const response = await this._httpClient.post<string>(
      this.endpoint, { data }
    );
    return response.data;
  }

  public async put(data: UserModel) {
    const response = await this._httpClient.put<string>(
      this.endpoint, { data }
    );
    return response.data;
  }

  public async patch(data: UserModel) {
    const response = await this._httpClient.patch<string>(
      this.endpoint, { data }
    );
    return response.data;
  }

  public async delete(id: number) {
    const response = await this._httpClient.delete<string>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }

  public async saveUserAcceptedTerms(id: number) {
    const response = await this._httpClient.put<string>(
      `${this.endpoint}/accepted-terms/${id}`
    );
    return response.data;
  }

  public async postBookLog(data: UserBookLogModel) {
    const response = await this._httpClient.post<string>(
      `${this.endpoint}/book-log`, { data }
    );
    return response.data;
  }
}

export default new UserService();
