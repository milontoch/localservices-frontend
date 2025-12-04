import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCategories, registerProvider, requestOtp, verifyOtp, uploadVerification, setAuthToken, setUser } from '../../services/api';
import { geocodeAddress } from '../../services/mapbox';

export default function ProviderRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    category_id: '',
    experience_years: 1,
    address: ''
  });
  const [otp, setOtp] = useState('');
  const [verificationDoc, setVerificationDoc] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Geocode address
      let coords = { lat: null, lng: null };
      if (formData.address) {
        coords = await geocodeAddress(formData.address) || coords;
      }

      const response = await registerProvider({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        category_id: formData.category_id,
        experience_years: formData.experience_years,
        latitude: coords.lat,
        longitude: coords.lng
      });

      setProviderId(response.data.provider.id);

      // Request OTP
      await requestOtp({
        phone_number: formData.phone_number,
        user_type: 'provider'
      });

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.errors ? 
        Object.values(err.response.data.errors).flat().join(', ') :
        'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await verifyOtp({
        phone_number: formData.phone_number,
        otp: otp,
        user_type: 'provider'
      });

      setAuthToken(response.data.access_token);
      setUser(response.data.user);
      
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadVerification = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationDoc) {
      setError('Please select a verification document');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('provider_id', providerId);
      formData.append('document', verificationDoc);

      await uploadVerification(formData);
      
      alert('Verification document uploaded! Your account will be reviewed by an admin.');
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Register as Provider - LocalServices</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto card">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Become a Service Provider</h1>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8 pb-8 border-b border-gray-200">
            <div className={`flex-1 text-center text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 ${step >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <p>Register</p>
            </div>
            <div className={`flex-1 text-center text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 ${step >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <p>Verify Phone</p>
            </div>
            <div className={`flex-1 text-center text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 ${step >= 3 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
                3
              </div>
              <p>Upload ID</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    className="input-field"
                    placeholder="+2348012345678"
                    required
                  />
                </div>

                <div>
                  <label className="label">Service Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="input-field"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input-field"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="label">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="input-field"
                    minLength="6"
                    required
                  />
                </div>

                <div>
                  <label className="label">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Registering...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-center text-gray-600 mb-4">
                We've sent a verification code to <span className="font-medium">{formData.phone_number}</span>
              </p>

              <div>
                <label className="label">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field text-center text-2xl tracking-widest"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  placeholder="000000"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleUploadVerification} className="space-y-4">
              <p className="text-center text-gray-600 mb-4">
                Upload a government-issued ID or business license for verification
              </p>

              <div>
                <label className="label">Verification Document</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setVerificationDoc(e.target.files[0])}
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Accepted formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Uploading...' : 'Submit for Verification'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                Your account will be reviewed by our team within 24-48 hours
              </p>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
