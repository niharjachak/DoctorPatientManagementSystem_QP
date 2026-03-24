// File input for uploading doctor images
export default function FileUploadInput({
  label,
  name,
  onChange,
  error = "",
  accept = "image/*"  // Only accept image files
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="file"
        name={name}
        onChange={onChange}
        accept={accept}
        className={`w-full px-4 py-2 border rounded-lg ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
