import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import ProviderCard from '../components/ProviderCard';
import { getCategories, getProviders } from '../services/api';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featuredProviders, setFeaturedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, providersRes] = await Promise.all([
        getCategories(),
        getProviders({ per_page: 6, min_rating: 4 })
      ]);
      
      setCategories(categoriesRes.data);
      setFeaturedProviders(providersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchData) => {
    const params = new URLSearchParams();
    if (searchData.category) params.append('category', searchData.category);
    if (searchData.location) params.append('q', searchData.location);
    if (searchData.lat) params.append('lat', searchData.lat);
    if (searchData.lng) params.append('lng', searchData.lng);
    
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (slug) => {
    router.push(`/search?category=${slug}`);
  };

  return (
    <Layout>
      <Head>
        <title>LocalServices - Find Trusted Service Providers Near You</title>
        <meta name="description" content="Connect with verified local service providers for plumbing, carpentry, cleaning, and more." />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Trusted Local Service Providers
            </h1>
            <p className="text-xl mb-8">
              Connect with verified professionals in your area
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
        
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="card hover:shadow-lg transition-shadow text-center cursor-pointer"
              >
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.providers_count || 0} providers</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Providers */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Top Rated Providers</h2>
          
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">LocalServices</h3>
            <p className="text-gray-400 mb-4">Connecting customers with trusted service providers</p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:support@localservices.com" className="hover:text-primary-400">
                Contact: support@localservices.com
              </a>
            </div>
            <p className="text-gray-500 mt-4 text-sm">
              © 2024 LocalServices. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
