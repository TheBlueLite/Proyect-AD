import React, { useState } from 'react';
import api from '../api/axios';
import { Send, Upload } from 'lucide-react';

export const CreatePost = ({ onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [minLayer, setMinLayer] = useState(1);
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('min_layer', minLayer);
      
      if (tags) {
        // Enviar tags separados por coma
        const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
        formData.append('tags', JSON.stringify(tagList));
      }

      if (file) {
        formData.append('file', file);
      }

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Limpiar formulario
      setTitle('');
      setDescription('');
      setMinLayer(1);
      setTags('');
      setFile(null);

      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al publicar contenido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-darkCard border border-neonBorder/30 rounded-lg p-5 mb-8 shadow-xl">
      <h3 className="text-md font-semibold text-neonAccent mb-4 tracking-wider flex items-center gap-2">
        <Send className="w-4 h-4" /> NUEVA PUBLICACIÓN
      </h3>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-3 py-1.5 rounded mb-4 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Título de la publicación..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm"
            required
          />
        </div>

        <div>
          <textarea
            placeholder="Descripción o contenido..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm h-20 resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Capa Mínima de Acceso</label>
            <select
              value={minLayer}
              onChange={(e) => setMinLayer(Number(e.target.value))}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm"
            >
              <option value={1}>Capa 1 - Público / Básico</option>
              <option value={2}>Capa 2 - Nivel Estándar</option>
              <option value={3}>Capa 3 - Nivel Confidencial</option>
              <option value={4}>Capa 4 - Nivel Avanzado</option>
              <option value={5}>Capa 5 - Restringido / Root</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Tags (separados por coma)</label>
            <input
              type="text"
              placeholder="nintendo, cyber, dev"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded border border-gray-700 text-xs text-gray-300 transition">
            <Upload className="w-4 h-4 text-neonBorder" />
            <span>{file ? file.name : 'Adjuntar archivo / imagen'}</span>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-neonBorder/20 hover:bg-neonBorder/40 text-neonAccent font-semibold px-5 py-1.5 rounded border border-neonAccent/50 transition text-sm disabled:opacity-50"
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};