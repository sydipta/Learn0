import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmClassName?: string
  isPending?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmClassName = 'bg-blue-600 hover:bg-blue-700',
  isPending = false,
  onConfirm,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-5 whitespace-pre-line">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50 ${confirmClassName}`}
          >
            {isPending ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}