import { normalizeApiError } from "../utils/api-error";

const interceptorConfig = {
  getToken: () => null,
  onUnauthorized: null,
  onForbidden: null,
};

export function configureInterceptors(config = {}) {
  if (typeof config.getToken === "function") {
    interceptorConfig.getToken = config.getToken;
  }

  if (typeof config.onUnauthorized === "function") {
    interceptorConfig.onUnauthorized = config.onUnauthorized;
  }

  if (typeof config.onForbidden === "function") {
    interceptorConfig.onForbidden = config.onForbidden;
  }
}

export function resetInterceptorConfig() {
  interceptorConfig.getToken = () => null;
  interceptorConfig.onUnauthorized = null;
  interceptorConfig.onForbidden = null;
}

export function attachInterceptors(client) {
  if (client.__hasApiInterceptors) {
    return client;
  }

  client.interceptors.request.use(
    (config) => {
      const token = interceptorConfig.getToken?.();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(normalizeApiError(error)),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const normalizedError = normalizeApiError(error);

      if (normalizedError.status === 401 && interceptorConfig.onUnauthorized) {
        await interceptorConfig.onUnauthorized(normalizedError);
      }

      if (normalizedError.status === 403 && interceptorConfig.onForbidden) {
        await interceptorConfig.onForbidden(normalizedError);
      }

      return Promise.reject(normalizedError);
    },
  );

  client.__hasApiInterceptors = true;
  return client;
}

