import axios from "axios";
import {
  attachInterceptors,
  configureInterceptors,
  resetInterceptorConfig,
} from "./interceptors";

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

attachInterceptors(apiClient);

export function setApiClientAuthHandlers(config) {
  configureInterceptors(config);
}

export function clearApiClientAuthHandlers() {
  resetInterceptorConfig();
}

export { baseURL };
export default apiClient;

