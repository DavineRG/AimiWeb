import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User } from '../../types';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('No user data returned');

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile) throw new Error('No profile found');

      onLogin({
        id: profile.id,
        username: profile.username,
        points: profile.points || 0,
        level: profile.level || 1,
        mobile: profile.mobile_number || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      
      alert('Password reset instructions have been sent to your email');
      setShowForgotPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
        <h2 className="text-xl font-semibold text-[#4B0082] mb-4">Reset Password</h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleForgotPassword}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <div className="flex space-x-3 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowForgotPassword(false)}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold text-[#4B0082] mb-4">Welcome to Aimi Point</h2>
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" fullWidth className="mt-4" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-[#FF69B4] hover:underline text-sm"
            onClick={() => setShowForgotPassword(true)}
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>For demo purposes, use:</p>
        <p>Email: demo@aimipoint.com</p>
        <p>Password: demo123</p>
      </div>
    </div>
  );
};

export default LoginForm;