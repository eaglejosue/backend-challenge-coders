import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  Method,
  AxiosPromise,
} from "axios";

import { toast } from "react-toastify";
import { AuthenticatedUserModel } from "../models/authenticated.model";

export interface Request {
  headers?: Record<string, string>;
  data?: any;
  params?: any;
}

export class HttpClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 60000,
    });

    this.httpClient.interceptors.request.use(this.handleRequestUse);
    this.httpClient.interceptors.response.use(
      this.handleResponseUse,
      this.handleError
    );
  }

  private handleRequestUse(config: InternalAxiosRequestConfig) {
    const user = AuthenticatedUserModel.fromLocalStorage();
    if (user && user.token?.length) config.headers["Authorization"] = `Bearer ${user.token}`;
    return config;
  }

  private handleResponseUse(config: AxiosResponse) {
    return config;
  }

  private handleError = (error: any) => {
    if (error.response && error.response.status === 401) {
      AuthenticatedUserModel.removeLocalStorage();
      window.location.href = "/";
    }
    if (error.response && error.response.data) {
      toast.error(error.response.data.error, {
        position: 'top-center',
        style: {maxWidth: 600}
      });
    }
    return Promise.reject(error);
  };

  private async handleRequest(
    url: string,
    method: Method,
    config: Request = {}
  ): Promise<AxiosResponse<any>> {
    const { headers, data, params } = config;

    const response = await this.httpClient.request({
      url,
      method,
      data,
      params,
      headers,
    });
    return response;
  }

  public get<T>(url: string, config: Request = {}): AxiosPromise<T> {
    return this.handleRequest(url, "get", config);
  }
  public post<T>(url: string, config: Request = {}): AxiosPromise<T> {
    return this.handleRequest(url, "post", config);
  }
  public put<T>(url: string, config: Request = {}): AxiosPromise<T> {
    return this.handleRequest(url, "put", config);
  }
  public delete<T>(url: string, config: Request = {}): AxiosPromise<T> {
    return this.handleRequest(url, "delete", config);
  }
  public patch<T>(url: string, config: Request = {}): AxiosPromise<T> {
    return this.handleRequest(url, "patch", config);
  }
}

export default new HttpClient();
