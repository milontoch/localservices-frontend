import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { getBlogPosts } from '../services/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getBlogPosts();
      setPosts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Blog - LocalServices</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Blog</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-600">No blog posts yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="mb-4">
                    <span className="text-sm text-primary-600">{post.category}</span>
                    <h2 className="text-2xl font-bold mt-2">{post.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content.substring(0, 150)}...
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {post.author_name}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
