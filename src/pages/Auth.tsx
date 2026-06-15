import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'signin' | 'signup';
type Mode = Tab | 'forgot' | 'newpassword';

export default function AuthPage() {
  const { user, recoveryMode, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]         = useState<Mode>('signin');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  // Recovery link clicked → switch to new-password form
  useEffect(() => {
    if (recoveryMode) {
      setMode('newpassword');
      setError(null);
      setSuccess(null);
      setPassword('');
      setConfirm('');
    }
  }, [recoveryMode]);

  // Already logged in (and not in password recovery) → redirect home
  useEffect(() => {
    if (user && !recoveryMode) navigate('/', { replace: true });
  }, [user, recoveryMode, navigate]);

  const reset = () => { setError(null); setSuccess(null); };

  const switchMode = (m: Mode) => { setMode(m); reset(); setPassword(''); setConfirm(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    setLoading(true);

    if (mode === 'forgot') {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error);
      } else {
        setSuccess('Check your email for a password reset link.');
      }
      setLoading(false);
      return;
    }

    if (mode === 'newpassword') {
      if (password !== confirm) { setError('Passwords do not match.'); setLoading(false); return; }
      if (password.length < 6)  { setError('Password must be at least 6 characters.'); setLoading(false); return; }
      const { error } = await updatePassword(password);
      if (error) {
        setError(error);
      } else {
        navigate('/', { replace: true });
      }
      setLoading(false);
      return;
    }

    if (mode === 'signup' && password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (mode === 'signup') {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! Signing you in…');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    }
    setLoading(false);
  };

  const inputClass = 'w-full pl-10 pr-10 py-2.5 rounded-lg text-base sm:text-sm text-white outline-none transition-colors';
  const inputStyle = { background: 'var(--faint)', border: '1px solid var(--border)' };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="jp text-4xl font-bold mb-1" style={{ color: 'var(--accent)' }}>日本語</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Nihongo · N5</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

          {/* Forgot password view */}
          {mode === 'forgot' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="mb-2">
                <p className="text-base font-semibold text-white mb-1">Reset password</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Enter your email and we'll send you a reset link.
                </p>
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                Send reset link
              </button>
              <button type="button" onClick={() => switchMode('signin')}
                className="text-xs text-center transition-opacity hover:opacity-70"
                style={{ color: 'var(--muted)' }}>
                Back to sign in
              </button>
            </form>
          )}

          {/* New password view (after clicking reset link) */}
          {mode === 'newpassword' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="mb-2">
                <p className="text-base font-semibold text-white mb-1">Set new password</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Choose a new password for your account.</p>
              </div>
              {(['Password', 'Confirm password'] as const).map((label, i) => (
                <div key={label} className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder={label}
                    value={i === 0 ? password : confirm}
                    onChange={e => i === 0 ? setPassword(e.target.value) : setConfirm(e.target.value)}
                    required
                    autoComplete="new-password"
                    className={inputClass}
                    style={inputStyle}
                  />
                  {i === 0 && (
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
              ))}
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity flex items-center justify-center gap-2"
                style={{ background: 'var(--accent)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                Update password
              </button>
            </form>
          )}

          {/* Sign in / Sign up tabs */}
          {(mode === 'signin' || mode === 'signup') && (
            <>
              <div className="flex rounded-lg p-0.5 mb-6" style={{ background: 'var(--faint)' }}>
                {(['signin', 'signup'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => switchMode(t)}
                    className="flex-1 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      background: mode === t ? 'var(--surface)' : 'transparent',
                      color: mode === t ? 'white' : 'var(--muted)',
                      boxShadow: mode === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                    }}
                  >
                    {t === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Email */}
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--muted)' }}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Confirm password (sign-up only) */}
                <AnimatePresence initial={false}>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
                        <input
                          type={showPw ? 'text' : 'password'}
                          placeholder="Confirm password"
                          value={confirm}
                          onChange={e => setConfirm(e.target.value)}
                          required={mode === 'signup'}
                          autoComplete="new-password"
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error / success */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
                    >
                      {success}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity mt-1 flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>

                {/* Forgot password link (sign-in only) */}
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-xs text-center transition-opacity hover:opacity-70"
                    style={{ color: 'var(--muted)' }}
                  >
                    Forgot password?
                  </button>
                )}
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Your progress syncs across all your devices.
        </p>
      </motion.div>
    </div>
  );
}
