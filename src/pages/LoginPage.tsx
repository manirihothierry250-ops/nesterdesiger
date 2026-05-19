import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function LoginPage() {
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    const authorizedEmails = ['jeanesta81@gmail.com', 'manirihothierry8@gmail.com', 'manirihothierry250@gmail.com'];
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user.email && authorizedEmails.includes(user.email)) {
        navigate('/admin');
      } else {
        await auth.signOut();
        setError('Access denied. This email is not authorized for admin access.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('Login popup was blocked. Please allow popups for this site.');
      } else {
        setError('Failed to sign in with Google.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-3xl"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 p-1 border border-white/10">
            <img src="/profile.png" alt="Nesta Design" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <h1 className="text-3xl font-heading font-black mb-2">Admin Access</h1>
          <p className="text-slate-500 text-sm">Sign in to manage Nesta Design</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-5 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 size={24} className="animate-spin text-brand-gold" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="text-lg">Continue with Google</span>
          </button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs text-center font-bold uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">Authorized Emails Only</p>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-brand-gold/50 font-mono tracking-tighter">jeanesta81@gmail.com</span>
              <span className="text-[10px] text-brand-gold/50 font-mono tracking-tighter">manirihothierry8@gmail.com</span>
              <span className="text-[10px] text-brand-gold/50 font-mono tracking-tighter">manirihothierry250@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">
            "Your administrative console is synchronized with the latest security protocols."
          </p>
        </div>
      </motion.div>
    </div>
  );
}
