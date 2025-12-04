import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getUser, removeAuthToken, removeUser } from '../services/api';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    setUser(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">
              LocalServices
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Blog
              </Link>

              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-800 font-medium">{user.full_name || user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary btn-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary btn-sm">
                    Sign Up
                  </Link>
                  <Link href="/provider/register" className="btn-secondary btn-sm">
                    Provider
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link href="/blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                Blog
              </Link>
              {user ? (
                <>
                  <div className="px-4 py-2 text-gray-800 font-medium">{user.full_name || user.name}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Login
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg">
                    Sign Up
                  </Link>
                  <Link href="/provider/register" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    Provider
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">LocalServices</h3>
              <p className="text-gray-600 text-sm">
                Connect with trusted local service providers in your area.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* For Providers */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 text-sm">Providers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/provider/register" className="text-gray-600 hover:text-blue-600 transition-colors">Register</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@localservices.com" className="text-gray-600 hover:text-blue-600 transition-colors">support@localservices.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <p>&copy; 2024 LocalServices. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
