import apiClient from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";
// funtion to book an appointment by sending a POST request with the doctor ID and slot ID as the payload,
//  and unwrapping the response to handle it in the application.
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

//function to fetch the list of appointments for the logged-in patient 
// by sending a GET request to the appointments endpoint,
export async function getMyAppointments() {
  const response = await apiClient.get(ENDPOINTS.patient.appointments);
  return unwrapApiData(response);
}

//function to cancel an appointment by sending a DELETE request with the appointment ID as a parameter
export async function cancelAppointment(appointmentId) {
  const response = await apiClient.delete(
    ENDPOINTS.patient.cancelAppointment(appointmentId),
  );

  return unwrapApiResponse(response);
}
