import { normalizeJson } from '../handlers/normalizeJson';

const GENERIC_MSG = (err: any) => `Failed to execute the request ${JSON.stringify(err, null, 2).replaceAll(/\{|\}/, '')}`; // revisit

type RequestOptions = {
  url: string;
  method: string;
  queryParams: string;
  concurrentData: string;
  headers: Record<string, string>;
  abortSignal: AbortSignal;
  data?: any;
};

const getBody = (data: any, method: string) => {
  if (!data || method === 'GET' || method === 'DELETE') {
    return null;
  }
  if (data instanceof FormData) {
    return data;
  }

  return JSON.stringify(normalizeJson(data, method));
};

const buildUrl = (apiUrl: string, url: string, params?: any) => {
  const baseUrl = `${apiUrl}/${url}`;

  if (!params) {
    return baseUrl;
  }

  let queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  if (queryParams !== '') {
    queryParams = `?${queryParams}`;
  }

  return `${baseUrl}${queryParams}`;
};

const makeRequest = async <T>(
  {
    url,
    method,
    data,
    queryParams,
    concurrentData,
    headers: headersOptions,
    abortSignal: signal,
  }: RequestOptions,
  apiUrl: string
): Promise<T> => {
  const headers = {
    accept: 'application/json',
    'x-requested-with': 'fetch',
    ...(headersOptions || {}),
  };

  if (concurrentData) {
    Object.assign(headers, {
      'x-concurrent-data': JSON.stringify(concurrentData),
    });
  }

  if (!(data instanceof FormData)) {
    Object.assign(headers, { 'content-type': 'application/json' });
  }

  const options = {
    body: getBody(data, method),
    headers,
    // credentials: 'include' as const,
    cache: 'no-store' as const,
    method,
    signal,
  };

  try {
    const requestUrl = buildUrl(apiUrl, url, queryParams);
    const response = await fetch(requestUrl, options);
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.startsWith('application/json');

    if (!response.ok) {
      let errorResponse;

      if (isJson) {
        errorResponse = await response.json();
      } else if (response.status === 404) {
        errorResponse = {
          code: 'NOT_FOUND',
          message: 'Not found',
        };
      } else {
        const text = await response.text();

        errorResponse = {
          code: 'UNKNOWN',
          message: text,
        };
      }

      throw new Error(GENERIC_MSG(errorResponse));
    }

    if (isJson) {
      return response.json() as Promise<T>;
    } 
  } catch (error) {
    throw new Error(GENERIC_MSG(error));
  }
};

export default makeRequest;
