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
