import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import RatingStars from '../../components/RatingStars';
import { getProvider, createContactRecord, checkContactRecord, createReview, getAuthToken } from '../../services/api';

export default function ProviderProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasContacted, setHasContacted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProvider();
      checkContact();
    }
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await getProvider(id);
      setProvider(response.data);
    } catch (error) {
      console.error('Error fetching provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkContact = async () => {
    if (!getAuthToken()) return;
    
    try {
      const response = await checkContactRecord({ provider_id: id });
      setHasContacted(response.data.has_contacted);
    } catch (error) {
      console.error('Error checking contact:', error);
    }
  };

  const handleContact = async (type) => {
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }

    try {
      await createContactRecord({ provider_id: id });
      setHasContacted(true);

      if (type === 'call') {
        window.location.href = `tel:${provider.phone_number}`;
      } else if (type === 'whatsapp') {
        window.open(`https://wa.me/${provider.phone_number.replace('+', '')}?text=Hi`, '_blank');
      }
    } catch (error) {
      console.error('Error recording contact:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!getAuthToken()) {
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        provider_id: id,
        ...reviewData
      });
      alert('Review submitted successfully!');
      setShowReviewForm(false);
      fetchProvider(); // Refresh to show new review
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-muted">Loading provider information...</p>
        </div>
      </Layout>
    );
  }

  if (!provider) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-muted">Provider not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{provider.full_name} - LocalServices</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{provider.full_name}</h1>
                  <p className="text-xl text-gray-600">{provider.category?.name}</p>
                </div>
                {provider.is_verified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>

              <div className="mb-6">
                <RatingStars rating={provider.rating_avg || 0} />
                <p className="text-gray-600 mt-2">
                  {provider.experience_years} years of experience
                </p>
              </div>

              {/* Portfolio */}
              {provider.portfolios && provider.portfolios.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {provider.portfolios.map((portfolio) => (
                      <div key={portfolio.id} className="relative h-48">
                        <Image
                          src={portfolio.image_url}
                          alt="Portfolio"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                
                {provider.reviews && provider.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {provider.reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">{review.user?.full_name}</p>
                            <RatingStars rating={review.rating} />
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && <p className="text-gray-700">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="text-xl font-bold mb-4">Contact Provider</h3>
              
              {provider.is_verified ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleContact('call')}
                    className="btn-primary w-full"
                  >
                    📞 Call Now
                  </button>
                  <button
                    onClick={() => handleContact('whatsapp')}
                    className="btn-secondary w-full"
                  >
                    💬 WhatsApp
                  </button>

                  {hasContacted && (
                    <div className="mt-6 pt-6 border-t">
                      {showReviewForm ? (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <h4 className="font-semibold">Leave a Review</h4>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Rating</label>
                            <select
                              value={reviewData.rating}
                              onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                              className="input-field"
                              required
                            >
                              <option value="5">5 - Excellent</option>
                              <option value="4">4 - Good</option>
                              <option value="3">3 - Average</option>
                              <option value="2">2 - Poor</option>
                              <option value="1">1 - Very Poor</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Comment (optional)</label>
                            <textarea
                              value={reviewData.comment}
                              onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                              className="input-field"
                              rows="4"
                              placeholder="Share your experience..."
                            />
                          </div>

                          <div className="flex space-x-2">
                            <button type="submit" disabled={submitting} className="btn-primary flex-1">
                              {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowReviewForm(false)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="btn-primary w-full"
                        >
                          ✍️ Leave a Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  This provider is pending verification and cannot be contacted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
