import Link from 'next/link';
import RatingStars from './RatingStars';

export default function ProviderCard({ provider }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="card hover:shadow-md cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">{provider.full_name}</h3>
            <p className="text-sm text-gray-600">{provider.category?.name}</p>
          </div>
          {provider.is_verified && (
            <span className="badge badge-green text-xs ml-2">✓ Verified</span>
          )}
        </div>

        <div className="mb-4 pb-4 border-b border-gray-200">
          <RatingStars rating={provider.rating_avg || 0} />
          <p className="text-sm text-gray-600 mt-2">
            {provider.experience_years || 0} years experience
          </p>
        </div>

        {provider.distance && (
          <p className="text-sm text-blue-600">
            📍 {provider.distance.toFixed(1)} km away
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {provider.reviews_count || 0} reviews
          </p>
        </div>
      </div>
    </Link>
  );
}
