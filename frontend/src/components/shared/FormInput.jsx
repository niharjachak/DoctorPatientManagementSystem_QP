// Reusable text input that handles label, value updates, and error messages
export default function FormInput({
  label,           // e.g., "Email"
  name,            // e.g., "email" (used in onChange)
  type = "text",   // "text", "password", "email", "number", etc
  value,           // Current value (from state)
  onChange,        // Function to call when user types
  error = "",      // Error message to show
  placeholder = ""
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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