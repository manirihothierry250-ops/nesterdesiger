import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Phone, ArrowRight, Loader2, Mail } from 'lucide-react';

export function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mapping logic
    let email = identifier;
    if (!identifier.includes('@')) {
      if (identifier === '0782739381') {
        email = 'jeanesta81@gmail.com';
      } else if (identifier === '078...' /* Add other mappings if needed */) {
        email = 'manirihothierry8@gmail.com';
      } else {
        email = `${identifier}@nesta.com`;
      }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials or admin access not enabled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-3xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 p-1 border border-white/10">
            <img src="/profile.png" alt="Nesta Design" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h1 className="text-3xl font-heading font-black mb-2">Admin Login</h1>
          <p className="text-slate-500 text-sm">Access the Nesta Design dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Email or Phone</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                {identifier.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-gold"
                placeholder="Email or Phone"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500 px-2 italic">Try: jeanesta81@gmail.com</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-gold"
                placeholder="••••••••"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500 px-2 italic">Default: nester11</p>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-600 text-xs leading-relaxed">
          <p>Note: Admin credentials must be enabled as Email/Password provider in the Firebase console.</p>
        </div>
      </motion.div>
    </div>
  );
}
