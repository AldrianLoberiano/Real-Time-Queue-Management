import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (adminLogin(username, password)) {
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm mx-4">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center bg-sky-500">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-0.5">Sign in to manage the queue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none transition-colors text-sm"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none transition-colors text-sm pr-9"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-200">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
