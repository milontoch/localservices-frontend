import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUser } from '../../services/api';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    setUserState(currentUser);
  }, [router]);

  if (!user) {
    return null;
  }

  const menuItems = [
    {
      title: 'Provider Verifications',
      description: 'Review and approve provider verification requests',
      href: '/admin/verifications',
      icon: '✓',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Manage Providers',
      description: 'View and manage all service providers',
      href: '/admin/providers',
      icon: '👤',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      href: '/admin/users',
      icon: '👥',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Review Moderation',
      description: 'Moderate user reviews',
      href: '/admin/reviews',
      icon: '⭐',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      href: '/admin/blog',
      icon: '📝',
      color: 'bg-red-50 text-red-600'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Admin Dashboard - LocalServices</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, <span className="font-medium">{user.name || user.email}</span></p>
        </div>

        <div className="grid-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a>
                <div className="card hover:shadow-lg transition-all ease-out duration-200 cursor-pointer">
                  <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center text-2xl mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
