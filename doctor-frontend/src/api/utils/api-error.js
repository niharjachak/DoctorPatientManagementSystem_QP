import axios from "axios";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export function normalizeApiError(error) {
  if (!axios.isAxiosError(error)) {
    return {
      status: null,
      message: error?.message || DEFAULT_ERROR_MESSAGE,
      fieldErrors: null,
      raw: error,
    };
  }

  const responseData = error.response?.data;
  const message =
    responseData?.message ||
    error.message ||
    DEFAULT_ERROR_MESSAGE;

  const fieldErrors =
    responseData &&
    responseData.data &&
    typeof responseData.data === "object" &&
    !Array.isArray(responseData.data)
      ? responseData.data
      : null;

  return {
    status: error.response?.status ?? null,
    message,
    fieldErrors,
    raw: error,
  };
}

