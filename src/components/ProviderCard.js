import Link from 'next/link';
import RatingStars from './RatingStars';

export default function ProviderCard({ provider }) {
  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="card group cursor-pointer overflow-hidden">
        {/* Header with category badge */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {provider.full_name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-600">{provider.category?.name}</span>
              {provider.is_verified && (
                <span className="badge-success flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rating and Experience */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="mb-2">
            <RatingStars rating={provider.rating_avg || 0} />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className="font-medium">{provider.reviews_count || 0} reviews</span>
            <span>{provider.experience_years || 0} yrs exp</span>
          </div>
        </div>

        {/* Distance and Info */}
        <div className="space-y-2">
          {provider.distance && (
            <div className="flex items-center text-sm text-primary-600 font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {provider.distance.toFixed(1)} km away
            </div>
          )}

          <div className="pt-2">
            <button className="w-full bg-primary-50 text-primary-600 py-2 rounded-lg font-medium hover:bg-primary-100 transition-colors group-hover:bg-gradient-primary group-hover:text-white">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
