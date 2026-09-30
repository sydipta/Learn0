import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReview } from '../api/reviews'
import { X, Star } from 'lucide-react'
import type { Connection } from '../types'

interface Props {
  connection: Connection
  onClose: () => void
}

export default function ReviewModal({ connection, onClose }: Props) {
  const queryClient = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const other = connection.requesterId === user.id ? connection.receiver : connection.requester

  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => createReview({
      connectionId: connection.id,
      revieweeId: other.id,
      rating,
      comment,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Rate your session</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${other.name}`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-800 text-sm">{other.name}</p>
            <p className="text-xs text-gray-500">{connection.post.subject}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-sm text-gray-700 font-medium mb-2">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={28}
                  className={`transition-colors ${star <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-5">
          <p className="text-sm text-gray-700 font-medium mb-2">Comment</p>
          <textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {isError && <p className="text-red-500 text-sm mb-3">Something went wrong. Try again.</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Skip
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending || rating === 0 || comment.length <=1}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}