import apiClient from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";

export async function bookAppointment(payload) {
  const requestBody = {
    doctorId: Number(payload.doctorId),
    slotId: Number(payload.slotId),
  };

  const response = await apiClient.post(
    ENDPOINTS.patient.bookAppointment,
    requestBody,
  );

  return unwrapApiResponse(response);
}

export async function getMyAppointments() {
  const response = await apiClient.get(ENDPOINTS.patient.appointments);
  return unwrapApiData(response);
}

export async function cancelAppointment(appointmentId) {
  const response = await apiClient.delete(
    ENDPOINTS.patient.cancelAppointment(appointmentId),
  );

  return unwrapApiResponse(response);
}
