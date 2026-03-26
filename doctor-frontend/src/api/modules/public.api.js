import apiClient, { baseURL } from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import { buildQueryParams } from "../utils/build-query-params";
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";

export async function getHospitals() {
  const response = await apiClient.get(ENDPOINTS.public.hospitals);
  return response.data;
}

export async function searchDoctors(filters = {}) {
  const response = await apiClient.get(ENDPOINTS.public.doctors, {
    params: buildQueryParams(filters),
  });

  return unwrapApiResponse(response);
}

export async function getDoctorDetails(doctorId) {
  const response = await apiClient.get(
    ENDPOINTS.public.doctorDetails(doctorId),
  );

  return unwrapApiResponse(response);
}

export function getDoctorImageUrl(doctorId) {
  return `${baseURL}${ENDPOINTS.public.doctorImage(doctorId)}`;
}

export async function getDoctorAvailability(doctorId) {
  const response = await apiClient.get(
    ENDPOINTS.public.doctorDetails(doctorId),
  );

  return unwrapApiData(response)?.availableSlots ?? [];
}

