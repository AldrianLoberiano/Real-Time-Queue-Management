import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useQueue } from '../../queue/QueueContext';

export function AdminLoginPage() {
  const { adminLogin } = useQueue();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const success = await adminLogin(username, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundImage: 'url(/header-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>

      <div className="w-full max-w-sm mx-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center bg-white/10 border border-white/20">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">Admin Login</h1>
            <p className="text-white/50 text-sm mt-0.5">Sign in to manage the queue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-colors text-sm"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/30 focus:border-white/40 focus:ring-1 focus:ring-white/40 outline-none transition-colors text-sm pr-9"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-rose-300 text-sm text-center bg-rose-500/20 py-2 rounded-lg border border-rose-400/30">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
