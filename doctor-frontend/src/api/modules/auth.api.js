import apiClient from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import { unwrapApiResponse } from "../utils/response-unwrapper";

// functions to handle authentication-related API calls, 
// such as registering patients and admins, logging in, and logging out.
export async function registerPatient(payload) {
  const response = await apiClient.post(ENDPOINTS.auth.registerPatient, payload);
  return unwrapApiResponse(response);
}

export async function registerAdmin(payload) {
  const response = await apiClient.post(ENDPOINTS.auth.registerAdmin, payload);
  return unwrapApiResponse(response);
}

export async function login(payload) {
  const response = await apiClient.post(ENDPOINTS.auth.login, payload);
  return unwrapApiResponse(response);
}

export async function logout() {
  const response = await apiClient.post(ENDPOINTS.auth.logout);
  return unwrapApiResponse(response);
}

