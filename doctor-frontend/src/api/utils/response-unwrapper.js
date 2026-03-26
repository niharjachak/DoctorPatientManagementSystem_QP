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

