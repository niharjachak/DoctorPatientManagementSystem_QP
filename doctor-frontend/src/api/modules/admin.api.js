import apiClient from "../client/http-client";
import { ENDPOINTS } from "../constants/endpoints";
import { buildCreateDoctorFormData } from "../utils/form-data-builder";
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";

export async function createDoctor({ data, image }) {
  const formData = buildCreateDoctorFormData(data, image);

  const response = await apiClient.post(ENDPOINTS.admin.createDoctor, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return unwrapApiResponse(response);
}

export async function getHospitalDoctors() {
  const response = await apiClient.get(ENDPOINTS.admin.hospitalDoctors);
  return unwrapApiData(response);
}

export async function updateDoctorStatus(doctorId, isActive) {
  const response = await apiClient.put(
    ENDPOINTS.admin.updateDoctorStatus(doctorId),
    null,
    {
      params: { isActive },
    },
  );

  return unwrapApiResponse(response);
}

export async function getAnalytics() {
  const response = await apiClient.get(ENDPOINTS.admin.analytics);
  return unwrapApiData(response);
}
