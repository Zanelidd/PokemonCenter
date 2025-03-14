export type RequestInterceptor = (
  url: RequestInfo,
  config?: RequestInit,
) => [RequestInfo, RequestInit] | RequestInit | void;

export type ResponseInterceptor = (response: Response) => Promise<Response>;

export interface Interceptors {
  request: RequestInterceptor[];
  response: ResponseInterceptor[];
}

export interface InterceptorHandler<T> {
  use: (callback: T) => number;
  eject: (id: number) => void;
}

export interface CustomFetch {
  interceptors: {
    request: InterceptorHandler<RequestInterceptor>;
    response: InterceptorHandler<ResponseInterceptor>;
  };

  (url: RequestInfo, config?: RequestInit): Promise<Response>;
}

