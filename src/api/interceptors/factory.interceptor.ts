import {
  CustomFetch,
  Interceptors,
  RequestInterceptor,
  ResponseInterceptor,
} from "../../types/api.types";

export function createFetchWithInterceptors(): CustomFetch {
  const interceptors: Interceptors = {
    request: [],
    response: [],
  };

  const customFetch = async (
    url: RequestInfo,
    config?: RequestInit
  ): Promise<Response> => {
    let resource: RequestInfo = url;
    let configuration: RequestInit = config ? { ...config } : {};

    for (const interceptor of interceptors.request) {
      const result = interceptor(resource, configuration);
      if (result) {
        if (Array.isArray(result)) {
          [resource, configuration] = result;
        } else {
          configuration = result;
        }
      }
    }

    const response = await fetch(resource, configuration);
    let processedResponse = response.clone();

    // Application des interceptors de réponse
    for (const interceptor of interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  };

  customFetch.interceptors = {
    request: {
      use: (callback: RequestInterceptor): number => {
        interceptors.request.push(callback);
        return interceptors.request.length - 1;
      },
      eject: (id: number): void => {
        interceptors.request.splice(id, 1);
      },
    },
    response: {
      use: (callback: ResponseInterceptor): number => {
        interceptors.response.push(callback);
        return interceptors.response.length - 1;
      },
      eject: (id: number): void => {
        interceptors.response.splice(id, 1);
      },
    },
  };

  return customFetch as CustomFetch;
}
