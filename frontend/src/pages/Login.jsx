import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Film, Sparkles } from 'lucide-react';

const Login = () => {
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect to page requested before auth, or home
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email/username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark relative flex items-center justify-center px-4 py-12 select-none overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-bg-card border border-white/5 p-8 rounded-xl shadow-2xl relative z-10 animate-slide-up">
        {/* Logo & Firebase Indicator */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-2 text-brand-red font-extrabold text-2xl tracking-wider">
            <Film className="w-8 h-8 fill-brand-red stroke-2" />
            <span>CINE<span className="text-white font-medium">SUGGEST</span></span>
          </div>
          <p className="text-neutral-400 text-xs">Sign in to access personalized movie intelligence</p>
          
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-semibold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Firebase Cloud Connected (cine-suggest-7787c)</span>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google One-Click Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full bg-white hover:bg-neutral-100 disabled:opacity-50 text-neutral-800 font-semibold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer mb-5"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-neutral-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-neutral-500 text-xs uppercase tracking-wider font-semibold">Or Email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email/Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">Username or Email</label>
            <div className="relative flex items-center bg-black/40 border border-neutral-800 focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red rounded-lg transition overflow-hidden">
              <span className="absolute left-3.5 text-neutral-500"><Mail className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Enter username or email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white placeholder-neutral-500 text-sm pl-11 pr-4 py-3 w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">Password</label>
            </div>
            <div className="relative flex items-center bg-black/40 border border-neutral-800 focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red rounded-lg transition overflow-hidden">
              <span className="absolute left-3.5 text-neutral-500"><Lock className="w-4 h-4" /></span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white placeholder-neutral-500 text-sm pl-11 pr-4 py-3 w-full focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-brand-red hover:bg-brand-dark-red disabled:bg-brand-red/50 text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer hover:shadow-brand-red/10 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Sign In with Password'
            )}
          </button>
        </form>

        {/* Navigation to Register */}
        <div className="text-center mt-6 pt-4 border-t border-white/5 text-sm text-neutral-400">
          <span>New to CineSuggest? </span>
          <Link to="/register" className="text-brand-red hover:underline font-semibold">Sign Up Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
