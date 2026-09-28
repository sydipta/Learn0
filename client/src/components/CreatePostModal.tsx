import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/posts'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
  defaultType?: 'learning_request' | 'teaching_offer'
}

export default function CreatePostModal({ onClose, defaultType = 'learning_request' }: Props) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    type: defaultType,
    subject: '',
    description: '',
    tags: '',
  })

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => createPost({
      type: form.type,
      subject: form.subject,
      description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      onClose()
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Create a New Post</h2>
          <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-800" /></button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setForm({ ...form, type: 'learning_request' })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${form.type === 'learning_request' ? 'bg-red-50 border-red-300 text-red-600' : 'border-gray-200 text-gray-500'}`}
          >
            I want to Learn
          </button>
          <button
            onClick={() => setForm({ ...form, type: 'teaching_offer' })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border ${form.type === 'teaching_offer' ? 'bg-green-50 border-green-300 text-green-600' : 'border-gray-200 text-gray-500'}`}
          >
            I want to Teach
          </button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Subject (e.g. DSA, Machine Learning)"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Describe what you want to learn or teach..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <input
            placeholder="Tags (comma separated, e.g. Python, Beginner, NumPy)"
            value={form.tags}
            onChange={e => setForm({ ...form, tags: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isError && <p className="text-red-500 text-sm mt-3">Something went wrong. Try again.</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending || !form.subject || !form.description}
            className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  )
}