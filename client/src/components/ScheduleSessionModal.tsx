import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSession } from '../api/sessions'
import { X } from 'lucide-react'

interface Props {
  connectionId: string
  subject: string
  onClose: () => void
}

const padTimeValue = (value: number) => value.toString().padStart(2, '0')
const hourOptions = Array.from({ length: 12 }, (_, index) => index + 1)
const minuteOptions = Array.from({ length: 60 }, (_, index) => index)

export default function ScheduleSessionModal({ connectionId, subject, onClose }: Props) {
  const queryClient = useQueryClient()
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledHour, setScheduledHour] = useState('')
  const [scheduledMinute, setScheduledMinute] = useState('')
  const [scheduledPeriod, setScheduledPeriod] = useState<'AM' | 'PM' | ''>('')
  const [isScheduled, setIsScheduled] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const selectedDateTime = scheduledDate && scheduledHour && scheduledMinute && scheduledPeriod
    ? new Date(`${scheduledDate}T${padTimeValue((Number(scheduledHour) % 12) + (scheduledPeriod === 'PM' ? 12 : 0))}:${scheduledMinute}`)
    : null
  const isPastDateTime = selectedDateTime !== null && selectedDateTime.getTime() <= Date.now()
  const isPastTimeOption = (hour: string, minute: string, period: string) => {
    if (scheduledDate !== today || !hour || !minute || !period) return false

    const optionTime = new Date(`${scheduledDate}T${padTimeValue((Number(hour) % 12) + (period === 'PM' ? 12 : 0))}:${minute}`)
    return optionTime.getTime() <= Date.now()
  }

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => createSession({
      connectionId,
      scheduledAt: selectedDateTime!.toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      setIsScheduled(true)
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Schedule Session</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
        </div>

        {isScheduled ? (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-green-700">Session scheduled successfully</p>
            <p className="text-sm text-gray-600 mt-2">Happy learning and growing together!</p>
            <button
              onClick={onClose}
              className="w-full mt-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">Topic: <span className="font-medium">{subject}</span></p>

            <div className="mb-5">
              <p className="text-sm text-gray-700 font-medium mb-2">Choose a date and time</p>
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-gray-500">Date</span>
                  <input
                    type="date"
                    value={scheduledDate}
                    min={today}
                    onChange={e => {
                      if (e.target.value >= today) setScheduledDate(e.target.value)
                    }}
                    className="mt-1 w-full h-12 border border-blue-200 rounded-lg bg-blue-50/40 px-3 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
                <div>
                  <span className="text-xs font-medium text-gray-500">Time</span>
                  <div className="grid grid-cols-3 gap-2 mt-1 sm:max-w-sm">
                    <select
                      value={scheduledHour}
                      onChange={e => setScheduledHour(e.target.value)}
                      className="w-full h-12 border border-blue-200 rounded-lg bg-blue-50/40 px-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Hour"
                    >
                      <option value="">Hr</option>
                      {hourOptions.map(hour => (
                        <option key={hour} value={hour} disabled={isPastTimeOption(String(hour), scheduledMinute, scheduledPeriod)}>
                          {padTimeValue(hour)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={scheduledMinute}
                      onChange={e => setScheduledMinute(e.target.value)}
                      className="w-full h-12 border border-blue-200 rounded-lg bg-blue-50/40 px-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Minute"
                    >
                      <option value="">Min</option>
                      {minuteOptions.map(minute => (
                        <option key={minute} value={padTimeValue(minute)} disabled={isPastTimeOption(scheduledHour, padTimeValue(minute), scheduledPeriod)}>
                          {padTimeValue(minute)}
                        </option>
                      ))}
                    </select>
                    <select
                      value={scheduledPeriod}
                      onChange={e => setScheduledPeriod(e.target.value as 'AM' | 'PM')}
                      className="w-full h-12 border border-blue-200 rounded-lg bg-blue-50/40 px-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="AM or PM"
                    >
                      <option value="">AM/PM</option>
                      <option value="AM" disabled={isPastTimeOption(scheduledHour, scheduledMinute, 'AM')}>AM</option>
                      <option value="PM" disabled={isPastTimeOption(scheduledHour, scheduledMinute, 'PM')}>PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {isPastDateTime && <p className="text-red-500 text-sm mb-3">Please choose a future date and time.</p>}
            {isError && <p className="text-red-500 text-sm mb-3">Something went wrong. Try again.</p>}

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => mutate()}
                disabled={isPending || !selectedDateTime || isPastDateTime}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isPending ? 'Scheduling...' : 'Schedule'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
