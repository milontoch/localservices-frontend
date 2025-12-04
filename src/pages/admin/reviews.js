import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUser, adminGetReviews, adminDeleteReview } from '../../services/api';
import RatingStars from '../../components/RatingStars';

export default function AdminReviews() {
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchReviews();
  }, [router]);

  const fetchReviews = async () => {
    try {
      const response = await adminGetReviews();
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review? This action cannot be undone.')) return;
    
    try {
      await adminDeleteReview(id);
      setReviews(reviews.filter(r => r.id !== id));
      alert('Review deleted');
    } catch (err) {
      alert('Failed to delete review');
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
        <title>Review Moderation - Admin</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Review Moderation</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No reviews found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{review.user?.full_name}</p>
                    <p className="text-sm text-gray-600">
                      for {review.provider?.full_name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm text-gray-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}

                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
