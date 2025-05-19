import React, { useState, useEffect } from 'react';
import { User, Theme, Reward } from '../types';
import LevelPath from '../components/game/LevelPath';
import Dashboard from '../components/game/Dashboard';
import RewardsModal from '../components/rewards/RewardsModal';
import { mockThemes, mockRewards } from '../data/mockData';

interface HomeProps {
  user: User;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [currentLevel, setCurrentLevel] = useState(user.level);
  const [currentTheme, setCurrentTheme] = useState<Theme | undefined>(undefined);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  
  // Find the current theme based on level
  useEffect(() => {
    const theme = mockThemes.find(
      theme => currentLevel >= theme.startLevel && currentLevel <= theme.endLevel
    );
    setCurrentTheme(theme);
  }, [currentLevel]);
  
  const handleLevelClick = (level: number) => {
    // In a real app, this would check if the level is unlocked
    if (level <= user.level) {
      setCurrentLevel(level);
    }
  };
  
  const handleRedeemReward = (rewardId: string) => {
    setRewards(
      rewards.map(reward =>
        reward.id === rewardId
          ? { ...reward, status: 'Redeemed' }
          : reward
      )
    );
    
    // In a real app, this would send a request to the server
    alert(`You've redeemed ${rewards.find(r => r.id === rewardId)?.name}!`);
  };
  
  return (
    <div 
      className="min-h-screen bg-cover bg-center pt-16 pb-28"
      style={{ 
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.9)), url(${currentTheme?.backgroundImage})` 
      }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-40 px-4 py-3">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#4B0082]">Aimi Point</h1>
          <button 
            onClick={onLogout}
            className="text-sm text-[#FF69B4] hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4">
        {/* Level section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#4B0082] mb-2">My Journey</h2>
          <div className="bg-white/80 rounded-xl shadow-md overflow-hidden p-2">
            <LevelPath 
              currentLevel={currentLevel} 
              onLevelClick={handleLevelClick} 
            />
          </div>
        </div>
        
        {/* Theme description */}
        <div className="bg-white/80 rounded-xl shadow-md p-4 mb-4">
          <h3 className="font-bold text-[#4B0082] mb-2">
            {currentTheme?.name || 'Adventure'} Theme
          </h3>
          <p className="text-gray-600 text-sm">
            {currentLevel === user.level
              ? `You're currently at level ${currentLevel} in the ${currentTheme?.name} zone. Keep collecting points to progress further!`
              : `This is level ${currentLevel} in the ${currentTheme?.name} zone. You've already passed this level!`
            }
          </p>
        </div>
        
        {/* Points info */}
        <div className="bg-white/80 rounded-xl shadow-md p-4">
          <h3 className="font-bold text-[#4B0082] mb-2">Points Info</h3>
          <p className="text-gray-600 text-sm mb-2">
            You have collected <span className="font-bold text-[#FF69B4]">{user.points}</span> points so far.
          </p>
          <p className="text-gray-600 text-sm">
            <strong>How to earn more:</strong> For every 1,000,000 IDR you spend, you'll earn 1 additional point.
          </p>
        </div>
      </div>
      
      {/* Dashboard */}
      <Dashboard 
        user={user} 
        onViewRewards={() => setShowRewards(true)} 
      />
      
      {/* Rewards Modal */}
      {showRewards && (
        <RewardsModal
          rewards={rewards}
          userLevel={user.level}
          onClose={() => setShowRewards(false)}
          onRedeem={handleRedeemReward}
        />
      )}
    </div>
  );
};

export default Home;