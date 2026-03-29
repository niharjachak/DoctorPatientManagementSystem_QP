import apiClient from "../client/http-client"; // axios instance with interceptors attached
import { ENDPOINTS } from "../constants/endpoints";//endpoints for admin module
import { buildCreateDoctorFormData } from "../utils/form-data-builder";// converts doctor data and image into FormData for multipart data

// helpers to unwrap API responses, extracting the relevant data or handling errors as needed.
import {
  unwrapApiData,
  unwrapApiResponse,
} from "../utils/response-unwrapper";

// creates a new doctor by sending a POST request with multipart/form-data,
//  including both the doctor data and an image file.
export async function createDoctor({ data, image }) {

  const formData = buildCreateDoctorFormData(data, image);

  console.log("FormData entries:", [...formData.entries()]);

  // sends a POST request to the create doctor endpoint with the FormData payload,
  //  and sets the Content-Type header to multipart/form-data to ensure the server can process it correctly.
  const response = await apiClient.post(ENDPOINTS.admin.createDoctor, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });


  return unwrapApiResponse(response);
}
// function to fetch the list of doctors associated with the hospital
export async function getHospitalDoctors() {
  const response = await apiClient.get(ENDPOINTS.admin.hospitalDoctors);
  return unwrapApiData(response);
}

// function to update the active status of a doctor, sending a PUT request with the doctor ID 
// and the new status as a query parameter.
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

//function to fetch analytics data for the hospital, 
// sending a GET request to the analytics endpoint and unwrapping the response data for use in the application.
export async function getAnalytics() {
  const response = await apiClient.get(ENDPOINTS.admin.analytics);
  return unwrapApiData(response);
}
