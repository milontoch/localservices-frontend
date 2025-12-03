import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getUser, removeAuthToken, removeUser } from '../services/api';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              LocalServices
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/blog" className="text-gray-700 hover:text-primary-600">
                Blog
              </Link>
              
              {user ? (
                <>
                  <span className="text-gray-700">Hi, {user.full_name || user.name}</span>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary">
                    Sign Up
                  </Link>
                  <Link href="/provider/register" className="btn-secondary">
                    Register as Provider
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
