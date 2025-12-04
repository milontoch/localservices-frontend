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
      <section className="section-hero bg-gradient-primary text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Find Trusted Local Service Providers
            </h1>
            <p className="text-xl text-primary-100 mb-12">
              Connect with verified professionals for plumbing, carpentry, cleaning, and more
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Browse by Category</h2>
            <p className="text-gray-600 text-lg">Find the service you need</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No categories available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.slug)}
                  className="card text-center hover:border-primary-200 group transition-all"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon || '🔧'}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.providers_count || 0} providers
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Top Rated Providers</h2>
            <p className="text-gray-600 text-lg">Our most trusted and highly-reviewed professionals</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading providers...</p>
            </div>
          ) : featuredProviders.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>No featured providers available at this time</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Become a Provider?</h2>
          <p className="text-primary-100 text-lg mb-8">Grow your business by connecting with customers in your area</p>
          <a href="/provider/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Register as Provider
          </a>
        </div>
      </section>
    </Layout>
  );
}
