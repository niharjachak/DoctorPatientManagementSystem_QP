// utility functions to unwrap API responses into a consistent format for easier handling in the application.
// unwrapApiResponse takes an API response and extracts the success status, message, and data payload,
// providing default values if any of these fields are missing from the response.
export function unwrapApiResponse(response) {
  const payload = response?.data ?? {};

  return {
    success: payload.success ?? true,
    message: payload.message ?? "",
    data: payload.data ?? null,
  };
}

export function unwrapApiData(response) {
  return unwrapApiResponse(response).data;
}

