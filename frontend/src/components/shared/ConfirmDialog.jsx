// Modal dialog to confirm user action before proceeding
export default function ConfirmDialog({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false 
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex gap-4 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white font-medium ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
