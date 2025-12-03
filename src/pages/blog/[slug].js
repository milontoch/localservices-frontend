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
        <div className="container mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          Post not found
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{post.title} - LocalServices Blog</title>
      </Head>

      <div className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-sm text-primary-600">{post.category}</span>
            <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>
            
            <div className="flex items-center text-gray-600 text-sm">
              <span>By {post.author_name}</span>
              <span className="mx-2">•</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {post.photo_url && (
            <div className="relative w-full h-96 mb-8">
              <Image
                src={post.photo_url}
                alt={post.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </div>
    </Layout>
  );
}
