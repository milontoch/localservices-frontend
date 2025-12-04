import { useState } from 'react';
import { getCurrentLocation } from '../services/mapbox';

export default function SearchBar({ onSearch }) {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'plumber', label: 'Plumber', icon: '🔧' },
    { id: 'carpenter', label: 'Carpenter', icon: '🪵' },
    { id: 'gardener', label: 'Gardener', icon: '🌱' },
    { id: 'fumigation', label: 'Fumigation', icon: '🧪' },
    { id: 'catering', label: 'Catering', icon: '🍽️' },
    { id: 'cleaner', label: 'Cleaner', icon: '🧹' },
    { id: 'electrician', label: 'Electrician', icon: '⚡' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category && !location) {
      alert('Please enter a category or location');
      return;
    }
    
    let searchData = { category, location };

    if (useCurrentLocation) {
      try {
        setIsLoading(true);
        const coords = await getCurrentLocation();
        searchData = { ...searchData, lat: coords.lat, lng: coords.lng };
      } catch (error) {
        console.error('Error getting location:', error);
        alert('Could not get your location.');
      } finally {
        setIsLoading(false);
      }
    }

    onSearch(searchData);
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const coords = await getCurrentLocation();
      setLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      setUseCurrentLocation(true);
    } catch (error) {
      alert('Could not get your location. Please enter manually.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-lg shadow-card-hover">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Find a Service Provider</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Category */}
        <div className="md:col-span-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Service Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field bg-white"
            disabled={isLoading}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="md:col-span-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setUseCurrentLocation(false);
            }}
            placeholder="Enter address or use current location"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-4 flex flex-col space-y-2">
          <div className="flex space-x-2 flex-1">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isLoading ? 'Searching...' : 'Search'}</span>
                </>
              ) : (
                <>
                  <span>🔍 Search</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              className="btn-secondary whitespace-nowrap"
              title="Use your current location"
            >
              📍
            </button>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-3 font-medium">Quick filters:</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat.id
                  ? 'bg-gradient-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
