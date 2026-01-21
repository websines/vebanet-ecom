'use client';

import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import type { Review } from '@/types';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium">{review.userName}</span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-green-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h4 className="text-white font-semibold mb-2">{review.title}</h4>

      {/* Content */}
      <p className="text-gray-300 leading-relaxed mb-4">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-700/50">
        <button
          onClick={() => onHelpful?.(review.id)}
          className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm"
        >
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.helpfulCount})
        </button>
      </div>
    </div>
  );
}
