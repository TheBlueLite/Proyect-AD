import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { CreatePost } from '../components/CreatePost';

export const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-neonAccent font-mono">Cargando publicaciones...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Componente para crear post */}
      <CreatePost onPostCreated={fetchPosts} />

      <h2 className="text-xl font-bold text-neonAccent mb-6 tracking-wide">FEED DE CONTENIDO</h2>

      <div className="grid gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-darkCard border border-neonBorder/20 rounded-lg p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neonAccent font-medium">@{post.author}</span>
              <span className="text-xs bg-black/40 text-neonBorder px-2.5 py-1 rounded border border-neonBorder/30">
                Capa Min: {post.min_layer}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>

            {post.content_url && (
              <div className="my-3 rounded overflow-hidden border border-gray-800 bg-black/30">
                <img
                  src={post.content_url.startsWith('http') ? post.content_url : `http://localhost:5000${post.content_url}`}
                  alt={post.title}
                  className="w-full max-h-96 object-contain"
                />
              </div>
            )}

            <p className="text-gray-300 text-sm mb-4">{post.description}</p>

            {post.tags && post.tags.length > 0 && post.tags[0] !== null && (
              <div className="flex gap-2">
                {post.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-neonBorder bg-neonBorder/10 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};