import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { getBlogPost } from '../../services/api';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const response = await getBlogPost(slug);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-muted">Loading blog post...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-muted">Blog post not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} - LocalServices Blog</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <article className="card">
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-blue">{post.category}</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium text-gray-800">{post.author_name}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.photo_url && (
            <div className="relative w-full h-80 mb-8 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={post.photo_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="btn-primary">Share Article</button>
          </div>
        </article>
      </div>
    </Layout>
  );
}
