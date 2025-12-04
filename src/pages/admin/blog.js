import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { getUser, adminGetBlogPosts, adminCreateBlogPost, adminDeleteBlogPost } from '../../services/api';

export default function AdminBlog() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    featured_image_url: ''
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login');
      return;
    }
    fetchPosts();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await adminGetBlogPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('content', formData.content);
      if (formData.featured_image_url) {
        formDataToSend.append('featured_image_url', formData.featured_image_url);
      }

      await adminCreateBlogPost(formDataToSend);
      setFormData({ title: '', slug: '', content: '', featured_image_url: '' });
      setShowForm(false);
      fetchPosts();
      alert('Blog post created');
    } catch (err) {
      setError(err.response?.data?.errors ? 
        Object.values(err.response.data.errors).flat().join(', ') :
        'Failed to create blog post');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post? This action cannot be undone.')) return;
    
    try {
      await adminDeleteBlogPost(id);
      setPosts(posts.filter(p => p.id !== id));
      alert('Blog post deleted');
    } catch (err) {
      alert('Failed to delete blog post');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
        <title>Blog Management - Admin</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Create New Post'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Create Blog Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    });
                  }}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="input-field"
                  rows="10"
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Publish Post
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Slug: {post.slug}
                  </p>
                  <p className="text-sm text-gray-600">
                    Published: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="text-primary-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
