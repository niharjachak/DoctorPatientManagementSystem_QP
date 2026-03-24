// Shows error messages that user can dismiss
export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="text-red-700 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )
}