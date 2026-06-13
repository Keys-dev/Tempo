import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import '../styles/Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for a confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Tempotask</h1>
          <p>{mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}</p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error">
            <span>{error}</span>
          </div>
        )}
        
        {message && (
          <div className="auth-alert auth-alert-success">
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>Email</label>
            <input 
              type="email" 
              className="auth-input"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              placeholder="name@example.com"
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="auth-input"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength={6}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          <button 
            className="auth-toggle-btn"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
