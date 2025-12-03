import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUser, adminGetVerifications, adminUpdateVerification } from '../../services/api';

export default function AdminVerifications() {
  const router = useRouter();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchVerifications();
  }, [router]);

  const fetchVerifications = async () => {
    try {
      const response = await adminGetVerifications();
      setVerifications(response.data.filter(v => v.status === 'pending'));
    } catch (err) {
      setError('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm('Approve this verification?')) return;
    
    try {
      await adminUpdateVerification(id, { status: 'approved' });
      setVerifications(verifications.filter(v => v.id !== id));
      alert('Verification approved');
    } catch (err) {
      alert('Failed to approve verification');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Reject this verification?')) return;
    
    try {
      await adminUpdateVerification(id, { status: 'rejected' });
      setVerifications(verifications.filter(v => v.id !== id));
      alert('Verification rejected');
    } catch (err) {
      alert('Failed to reject verification');
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
        <title>Provider Verifications - Admin</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Provider Verifications</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {verifications.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No pending verifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((verification) => (
              <div key={verification.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {verification.provider?.full_name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{verification.provider?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{verification.provider?.phone_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium">{verification.provider?.category?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-medium">{verification.provider?.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="font-medium">
                          {new Date(verification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {verification.document_url && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Verification Document</p>
                        <a
                          href={verification.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          View Document →
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(verification.id)}
                      className="btn-primary"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(verification.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
