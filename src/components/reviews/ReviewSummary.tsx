'use client';

import { Star } from 'lucide-react';
import type { ReviewSummary as ReviewSummaryType } from '@/types';

interface ReviewSummaryProps {
  summary: ReviewSummaryType;
}

export default function ReviewSummary({ summary }: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(summary.ratingDistribution));

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-start gap-8">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-white mb-2">
            {summary.averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(summary.averageRating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">
            Based on {summary.totalReviews} reviews
          </p>
        </div>

        {/* Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution];
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-gray-400 text-sm">{rating}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-gray-500 text-sm w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
