import React from 'react';
import GardenWindow from '../components/auth/GardenWindow';
import LoginForm from '../components/auth/LoginForm';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFC0CB]/30 to-white flex flex-col justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#4B0082]">Aimi Point</h1>
        <p className="text-[#FF69B4]">Loyalty Program</p>
      </div>
      
      <GardenWindow />
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default Login;