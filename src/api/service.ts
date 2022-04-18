import makeRequest from './makeRequest';
import {
  RequestQueryParams,
  sendFormRequestOptions,
  UpdateRequestOptions,
  GraphqlRequestOptions,
  RequestOptions,
  Middleware,
} from './types';
import { convertToFormData, serializeToFormData } from './util/formData';

class HttpClient {
  private middlewares: Middleware[] = [];
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  registerMiddleware(...middlewares: Middleware[]) {
    this.middlewares.push(...middlewares);
  }

  unregisterMiddleware(middleware: Middleware) {
    const index = this.middlewares.findIndex((m) => middleware === m);

    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }

  private executeWithMiddleware<
    T extends RequestOptions<unknown> | GraphqlRequestOptions
  >(func: (arg: T) => Promise<unknown>, arg: T) {
    return this.middlewares.reduceRight<() => Promise<unknown>>(
      (previous, current) => () => current(arg, previous),
      () => func(arg)
    );
  }

  private executeRequest<T, R = T>(
    options: RequestOptions<T>
  ): Promise<R> {
    return this.executeWithMiddleware(
      (opts) => makeRequest(opts, this.apiUrl),
      options
    )() as Promise<R>;
  }

  async get<T, R = T>(
    url: string,
    queryParams?: RequestQueryParams,
    abortSignal?: AbortSignal
  ) {
    return this.executeRequest<T, R>({
      url,
      method: 'GET',
      queryParams,
      abortSignal,
    });
  }

  async post<T, R = T>(
    url: string,
    data: Partial<T> | null,
    queryParams?: RequestQueryParams,
    abortSignal?: AbortSignal
  ) {
    return this.executeRequest<T, R>({
      url,
      method: 'POST',
      data,
      queryParams,
      abortSignal,
    });
  }

  async put<T, R = T>(options: UpdateRequestOptions<T>) {
    const { url, data, queryParams = {}, concurrentData } = options;

    return this.executeRequest<T, R>({
      url,
      method: 'PUT',
      data,
      queryParams,
      concurrentData,
    });
  }

  async delete<T, R = T>(url: string, queryParams?: RequestQueryParams) {
    return this.executeRequest<T, R>({ url, method: 'DELETE', queryParams });
  }

  async patch<T, R = T>(options: UpdateRequestOptions<T>) {
    const { url, data, queryParams = {}, concurrentData } = options;

    return this.executeRequest<T, R>({
      url,
      method: 'PATCH',
      data,
      queryParams,
      concurrentData,
    });
  }

  async sendForm<T extends Record<string, unknown>, R = T>(
    options: sendFormRequestOptions<T>
  ) {
    const {
      url,
      data,
      method = 'POST',
      queryParams = {},
      concurrentData,
    } = options;
    const formData = serializeToFormData(data, method);

    return this.executeRequest<T, R>({
      url,
      method,
      data: formData,
      queryParams,
      concurrentData,
    });
  }

  async sendFiles<T, R = T>(options: sendFormRequestOptions<File[]>) {
    const {
      url,
      data,
      method = 'POST',
      queryParams = {},
      concurrentData,
      headers = {},
    } = options;
    const formData = convertToFormData(data);

    return this.executeRequest<T, R>({
      url,
      method,
      data: formData,
      queryParams,
      concurrentData,
      headers,
    });
  }
}

export const mainHttpClient = new HttpClient('change/me');
