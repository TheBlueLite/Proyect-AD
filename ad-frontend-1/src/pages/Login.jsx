import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBg px-4">
      <div className="bg-darkCard p-8 rounded-lg border border-neonBorder/30 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-neonAccent tracking-widest mb-2">AFTERDARK</h2>
        <p className="text-xs text-center text-gray-400 mb-6 uppercase tracking-wider">Acceso al Sistema de Capas</p>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-gray-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neonAccent text-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-neonBorder/20 hover:bg-neonBorder/40 text-neonAccent font-semibold py-2.5 rounded border border-neonAccent/50 transition tracking-wider text-sm mt-4"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </div>
  );
};