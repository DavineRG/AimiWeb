import React, { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { User } from './types';
import { mockUser } from './data/mockData';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate checking for logged in user
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLogout = () => {
    setUser(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFC0CB]/30 to-white">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[#FF69B4] border-t-transparent animate-spin"></div>
          <h1 className="text-xl font-bold text-[#4B0082]">Loading Aimi Point...</h1>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;