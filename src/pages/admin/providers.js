import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUser, adminGetProviders } from '../../services/api';

export default function AdminProviders() {
  const router = useRouter();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchProviders();
  }, [router]);

  const fetchProviders = async () => {
    try {
      const response = await adminGetProviders();
      setProviders(response.data);
    } catch (err) {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Manage Providers - Admin</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Manage Providers</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Rating</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{provider.full_name}</td>
                  <td className="py-3 px-4">{provider.category?.name}</td>
                  <td className="py-3 px-4">{provider.email}</td>
                  <td className="py-3 px-4">{provider.phone_number}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      provider.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {provider.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {provider.average_rating ? provider.average_rating.toFixed(1) : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => router.push(`/providers/${provider.id}`)}
                      className="text-primary-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
