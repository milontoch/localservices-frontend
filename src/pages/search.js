import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import ProviderCard from '../components/ProviderCard';
import SearchBar from '../components/SearchBar';
import { getProviders } from '../services/api';

export default function SearchPage() {
  const router = useRouter();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (router.isReady) {
      fetchProviders();
    }
  }, [router.isReady, router.query]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = { ...router.query };
      const response = await getProviders(params);
      setProviders(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching providers:', error);
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

  return (
    <Layout>
      <Head>
        <title>Search Results - LocalServices</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Search Providers</h1>
        
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading providers...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 pb-4 border-b border-gray-200">
              <p className="text-gray-700 font-medium">
                Found {total} provider{total !== 1 ? 's' : ''}
              </p>
            </div>

            {providers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-700 font-medium">No providers found</p>
                <p className="text-muted mt-2">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid-3">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
