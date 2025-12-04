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
      <section className="bg-blue-50 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find Trusted Local Service Providers
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with verified professionals in your area
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by Category</h2>
            <p className="text-muted">Find the service you need</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No categories available
            </div>
          ) : (
            <div className="grid-auto md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="card text-center hover:border-blue-300 transition-all duration-200"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.providers_count || 0} providers
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title">Top Rated Providers</h2>
            <p className="text-muted">Our most trusted professionals</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted">Loading providers...</p>
            </div>
          ) : featuredProviders.length === 0 ? (
            <div className="text-center py-12 text-muted">
              No featured providers available
            </div>
          ) : (
            <div className="grid-3">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
