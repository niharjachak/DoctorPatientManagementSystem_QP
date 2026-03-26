import apiClient from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";

export async function changePassword(payload) {
  const response = await apiClient.post(
    ENDPOINTS.doctor.changePassword,
    payload,
  );

  return unwrapApiResponse(response);
}

export async function addSlot(payload) {
  const response = await apiClient.post(ENDPOINTS.doctor.addSlot, payload);
  return unwrapApiResponse(response);
}

export async function getMySlots() {
  const response = await apiClient.get(ENDPOINTS.doctor.slots);
  return unwrapApiData(response);
}

export async function deleteSlot(slotId) {
  const response = await apiClient.delete(ENDPOINTS.doctor.deleteSlot(slotId));
  return unwrapApiResponse(response);
}

