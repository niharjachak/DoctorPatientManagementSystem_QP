// Shows success messages (similar to ErrorAlert)
export default function SuccessAlert({ message, onDismiss }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="text-green-700 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )
}