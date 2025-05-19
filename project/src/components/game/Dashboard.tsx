import React from 'react';
import { User } from '../../types';
import Button from '../ui/Button';
import { Award, Star } from 'lucide-react';

interface DashboardProps {
  user: User;
  onViewRewards: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewRewards }) => {
  // Calculate progress to next level (simplified)
  const pointsForCurrentLevel = user.level * 10;
  const pointsForNextLevel = (user.level + 1) * 10;
  const progressPercentage = ((user.points - pointsForCurrentLevel) / 
    (pointsForNextLevel - pointsForCurrentLevel)) * 100;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 p-4">
      <div className="max-w-md mx-auto">
        {/* User info row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#FFC0CB] rounded-full flex items-center justify-center">
              <span className="text-[#4B0082] font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-[#4B0082]">{user.username}</h3>
              <div className="flex items-center space-x-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-600">Level {user.level}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Points</div>
            <div className="font-bold text-[#FF69B4]">{user.points}</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div 
            className="h-full bg-[#FF69B4] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Rewards button */}
        <Button 
          onClick={onViewRewards}
          fullWidth
          className="flex items-center justify-center space-x-2"
        >
          <Award size={18} />
          <span>View Rewards</span>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;