import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User } from '../../types';
import { mockUser } from '../../data/mockData';

interface LoginFormProps {
  onLogin: (user: User) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [mobile, setMobile] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // In a real app, this would be an API call
    if (username === 'aimi_user' && password === 'password') {
      onLogin(mockUser);
    } else {
      setError('Invalid username or password');
    }
  };
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a password reset flow
    alert(`Password reset link sent to ${mobile}`);
    setShowForgotPassword(false);
  };
  
  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-4">
        <h2 className="text-xl font-semibold text-[#4B0082] mb-4">Reset Password</h2>
        <form onSubmit={handleForgotPassword}>
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="+62123456789"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            fullWidth
            required
          />
          <div className="flex space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)}>
              Back
            </Button>
            <Button type="submit" fullWidth>
              Send Reset Link
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
          label="Username"
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <Button type="submit" fullWidth className="mt-4">
          Login
        </Button>
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-[#FF69B4] hover:underline text-sm"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </div>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>For demo purposes, use:</p>
        <p>Username: aimi_user</p>
        <p>Password: password</p>
      </div>
    </div>
  );
};

export default LoginForm;