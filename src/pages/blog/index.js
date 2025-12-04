import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getBlogPosts } from '../../services/api';

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

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Blog</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted py-12">No blog posts yet</p>
        ) : (
          <div className="grid-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="card hover:shadow-md cursor-pointer">
                  <div className="mb-4">
                    <span className="badge badge-blue text-xs">{post.category}</span>
                    <h2 className="text-lg font-semibold text-gray-800 mt-3">{post.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.content.substring(0, 150)}...
                  </p>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>By {post.author_name}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
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
