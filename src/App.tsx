import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { User } from './types';
import { supabase } from './lib/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) throw profileError;
          
          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              points: profile.points || 0,
              level: profile.level || 1,
              mobile: profile.mobile_number || ''
            });
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
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