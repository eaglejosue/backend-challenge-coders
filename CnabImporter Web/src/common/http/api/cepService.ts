import { HttpClient } from "../httpClient";

export class CepService {
  private _httpClient!: HttpClient;

  constructor() {
    this._httpClient = new HttpClient();
  }

  public async getByCep(cep: string) {
    const response = await this._httpClient.get(
      `https://viacep.com.br/ws/${cep}/json/`
    );
    return response.data;
  }
}

export default new CepService();
