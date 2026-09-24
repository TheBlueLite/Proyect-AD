import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, User, Home } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-darkCard border-b border-neonBorder/30 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-widest text-neonAccent">AFTERDARK</h1>
        <span className="text-xs bg-black/40 text-neonBorder px-2 py-1 rounded border border-neonBorder/20">v1.0</span>
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Badge de Capa de Autorización */}
            <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-full border border-neonAccent/40 text-neonAccent font-mono text-sm">
              <Shield className="w-4 h-4 text-neonAccent" />
              <span>CAPA {user.layer || 1}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <User className="w-4 h-4 text-neonBorder" />
              <span className="font-semibold">{user.username}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 px-3 py-1.5 rounded transition border border-red-500/20 text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </>
        ) : (
          <span className="text-sm text-gray-400">No autenticado</span>
        )}
      </div>
    </nav>
  );
};