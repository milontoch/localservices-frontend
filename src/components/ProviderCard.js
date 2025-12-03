import Link from 'next/link';
import RatingStars from './RatingStars';

export default function ProviderCard({ provider }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="card hover:shadow-xl transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{provider.full_name}</h3>
            <p className="text-gray-600">{provider.category?.name}</p>
          </div>
          {provider.is_verified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>

        <div className="mb-4">
          <RatingStars rating={provider.rating_avg || 0} />
          <p className="text-sm text-gray-600 mt-1">
            {provider.experience_years} years experience
          </p>
        </div>

        {provider.distance && (
          <p className="text-sm text-primary-600">
            📍 {provider.distance.toFixed(1)} km away
          </p>
        )}

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            {provider.reviews_count || 0} reviews
          </p>
        </div>
      </div>
    </Link>
  );
}
