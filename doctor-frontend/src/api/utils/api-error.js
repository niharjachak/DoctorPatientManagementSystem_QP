import axios from "axios";
// utility function to normalize API errors into a consistent format for easier handling in the application.
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";


export function normalizeApiError(error) {
  // checks if the error is an Axios error, which indicates it was an HTTP error response from the server.
  if (!axios.isAxiosError(error)) {
    return {
      status: null,
      message: error?.message || DEFAULT_ERROR_MESSAGE,
      fieldErrors: null,
      raw: error,
    };
  }

  // extracts the error message and any field-specific errors from the response data,
  // and returns a normalized error object that can be used consistently across the application for error handling.
  const responseData = error.response?.data;
  const message =
    responseData?.message ||
    error.message ||
    DEFAULT_ERROR_MESSAGE;

    // checks if the response data contains a "data" field that is an object (but not an array),
    // and treats it as field-specific errors if it exists, allowing the application to display 
    // specific error messages for form fields or other inputs.
  const fieldErrors =
    responseData &&
    responseData.data &&
    typeof responseData.data === "object" &&
    !Array.isArray(responseData.data)
      ? responseData.data
      : null;

      // returns a normalized error object with the HTTP status code, 
      // error message, field errors (if any), and the raw error for debugging purposes.
  return {
    status: error.response?.status ?? null,
    message,
    fieldErrors,
    raw: error,
  };
}

