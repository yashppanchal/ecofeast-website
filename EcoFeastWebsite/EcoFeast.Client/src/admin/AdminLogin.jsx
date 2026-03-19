import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem('ecofeast_token', data.token);
      localStorage.setItem('ecofeast_user', data.username);
      navigate('/admin');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-eco-dark flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-eco-gold/30 flex items-center justify-center mx-auto mb-4"
               style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 100%)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c-5-2.5-9-7.5-9-14C7 5 10 3 12 2c2 1 5 3 9 6 0 6.5-4 11.5-9 14z" />
              <path d="M12 2v20" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-eco-cream font-bold">EcoFeast Admin</h1>
          <p className="text-eco-cream/40 text-sm mt-1">Sign in to manage your website</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/[0.03] border border-eco-gold/10 rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs text-eco-gold tracking-wider uppercase mb-1.5 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-white/[0.04] border border-eco-gold/15 rounded-lg px-4 py-3
                         text-eco-cream text-sm outline-none focus:border-eco-gold/40 transition-colors"
              placeholder="admin"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs text-eco-gold tracking-wider uppercase mb-1.5 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/[0.04] border border-eco-gold/15 rounded-lg px-4 py-3
                         text-eco-cream text-sm outline-none focus:border-eco-gold/40 transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-eco-gold to-eco-gold-dark text-eco-dark
                       rounded-lg py-3 text-sm font-semibold tracking-wide transition-all duration-200
                       hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(201,169,110,0.3)]
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-eco-cream/30 text-xs hover:text-eco-gold transition-colors">
            Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
