import type { Review } from '../../types'

interface Props {
  reviews: Review[]
}

export default function ReviewList({ reviews }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4">Reviews received</h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews received yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <article key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-sm text-gray-800">{review.reviewer.name}</p>
                <p className="text-sm text-amber-600">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
