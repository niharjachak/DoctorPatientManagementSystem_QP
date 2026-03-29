import { normalizeApiError } from "../utils/api-error";
//utility function that ensures that api errors are in same format 
// for every component that consumes the api client, making error 
// handling more consistent and easier to manage across the application.

// defualt interceptor configuration.
const interceptorConfig = {
  getToken: () => null,
  onUnauthorized: null,
  onForbidden: null,
};

// updates the interceptor configuration with the provided
// configuration, allowing you to set up authentication handlers.
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

// resets the interceptor configuration to its default state
export function resetInterceptorConfig() {
  interceptorConfig.getToken = () => null;
  interceptorConfig.onUnauthorized = null;
  interceptorConfig.onForbidden = null;
}

// attaches interceptors to the Axios instance for handling authentication and other request/response logic.
export function attachInterceptors(client) {
  if (client.__hasApiInterceptors) {
    return client;
  }

  // req interceptor that adds auth token to req headers
  // if available, and a res interceptor that handles 401 and 403 errors 
  // by calling the appropriate handlers from the interceptor configuration.
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

  // runs after a response is received, 
  // allowing you to handle errors globally, 
  
  // (e.g., 401 Unauthorized or 403 Forbidden) and invoking corresponding handlers.
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

