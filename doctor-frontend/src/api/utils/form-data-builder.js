// a utility function that constructs a FormData object for creating a doctor,
//  combining the doctor data (as a JSON blob) and an optional image file,
//  which is necessary for sending multipart/form-data requests to the server.
export function buildCreateDoctorFormData(data, image) {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });

  formData.append("data", jsonBlob);

  if (image) {
    formData.append("image", image);
  }

  return formData;
}
