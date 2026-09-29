import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSession } from '../api/sessions'
import { X } from 'lucide-react'

interface Props {
  connectionId: string
  subject: string
  onClose: () => void
}

export default function ScheduleSessionModal({ connectionId, subject, onClose }: Props) {
  const queryClient = useQueryClient()
  const [scheduledAt, setScheduledAt] = useState('')

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => createSession({
      connectionId,
      scheduledAt: new Date(scheduledAt).toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Schedule Session</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Topic: <span className="font-medium">{subject}</span></p>

        <div className="mb-5">
          <label className="text-sm text-gray-700 font-medium mb-1 block">Select Date & Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => setScheduledAt(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isError && <p className="text-red-500 text-sm mb-3">Something went wrong. Try again.</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending || !scheduledAt}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Scheduling...' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}
