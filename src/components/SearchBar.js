import { useState } from 'react';
import { getCurrentLocation } from '../services/mapbox';

export default function SearchBar({ onSearch }) {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const categories = [
    'plumber',
    'carpenter',
    'gardener',
    'fumigation',
    'catering',
    'cleaner',
    'electrician',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let searchData = { category, location };

    if (useCurrentLocation) {
      try {
        const coords = await getCurrentLocation();
        searchData = { ...searchData, lat: coords.lat, lng: coords.lng };
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }

    onSearch(searchData);
  };

  const handleUseCurrentLocation = async () => {
    try {
      const coords = await getCurrentLocation();
      setLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
      setUseCurrentLocation(true);
    } catch (error) {
      alert('Could not get your location. Please enter manually.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setUseCurrentLocation(false);
            }}
            placeholder="Enter location or use current"
            className="input-field"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button type="submit" className="btn-primary flex-1">
            Search
          </button>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn-secondary whitespace-nowrap"
          >
            📍 Use My Location
          </button>
        </div>
      </div>
    </form>
  );
}
