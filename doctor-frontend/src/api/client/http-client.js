import axios from "axios";// Axios is a popular HTTP client library for making API requests in JavaScript applications.
// interceptors are functions that run before a request is sent and after 
// a response is received, allowing you to modify the request or response as needed.
import {
  attachInterceptors,
  configureInterceptors,
  resetInterceptorConfig,
} from "./interceptors";

//reads base URL from environment variables, defaults to localhost if not set
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:8080";

  // Create an Axios instance with the base URL and default headers
  //  This instance will be used for all API requests, and the interceptors 
  // will handle authentication and other request/response logic automatically.
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

// Attach interceptors to the Axios instance for handling authentication and other request/response logic
attachInterceptors(apiClient);
// updates the interceptor configuration with the provided 
// configuration, allowing you to set up authentication handlers or 
// other logic that should run before requests are sent or after responses are received.
export function setApiClientAuthHandlers(config) {
  configureInterceptors(config);
}

// resets the interceptor configuration to its default state,
//  effectively removing any custom authentication handlers 
// or other logic that was previously set up.
export function clearApiClientAuthHandlers() {
  resetInterceptorConfig();
}


export { baseURL };
export default apiClient;

