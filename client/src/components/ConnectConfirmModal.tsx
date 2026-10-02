import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createConnection } from '../api/connections'
import type { Post } from '../types'

interface Props {
  post: Post
  onClose: () => void
}

export default function ConnectConfirmModal({ post, onClose }: Props) {
  const queryClient = useQueryClient()

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => createConnection({
      postId: post.id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Send Connection Request</h2>
        <p className="text-gray-600 text-sm mb-4">
          You're about to connect with <span className="font-semibold">{post.user.name}</span> for their post on <span className="font-semibold">"{post.subject}"</span>.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-1">{post.subject}</p>
          <p>{post.description}</p>
          <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${post.type === 'learning_request' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {post.type === 'learning_request' ? 'Looking to Learn' : 'Can Teach'}
          </span>
        </div>

        {isError && <p className="text-red-500 text-sm mb-3">Something went wrong. Try again.</p>}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  )
}