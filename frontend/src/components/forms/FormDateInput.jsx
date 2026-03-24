// Date picker input
export default function FormDateInput({
  label,
  name,
  value,
  onChange,
  error = "",
  min = "",  // Minimum date (e.g., today)
  max = ""   // Maximum date
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
