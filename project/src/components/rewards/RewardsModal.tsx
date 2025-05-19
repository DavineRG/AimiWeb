import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Reward } from '../../types';
import Button from '../ui/Button';

interface RewardsModalProps {
  rewards: Reward[];
  userLevel: number;
  onClose: () => void;
  onRedeem: (rewardId: string) => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ 
  rewards, 
  userLevel, 
  onClose,
  onRedeem 
}) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  const handleBackToList = () => {
    setSelectedReward(null);
  };
  
  const handleRedeem = () => {
    if (selectedReward) {
      onRedeem(selectedReward.id);
      // Reset selection after redemption
      setSelectedReward(null);
    }
  };
  
  const getStatusColor = (status: string, requiredLevel: number) => {
    if (status === 'Redeemed') return 'text-gray-400';
    if (status === 'Available') return 'text-green-500';
    if (userLevel < requiredLevel) return 'text-gray-400';
    return 'text-yellow-500';
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#4B0082]">
            {selectedReward ? 'Reward Details' : 'My Rewards'}
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedReward ? (
            // Reward detail view
            <div className="flex flex-col items-center">
              <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                <img 
                  src={selectedReward.imageUrl} 
                  alt={selectedReward.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h3 className="text-xl font-bold text-[#4B0082] mb-2">
                {selectedReward.name}
              </h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className={`text-sm font-medium ${getStatusColor(selectedReward.status, selectedReward.requiredLevel)}`}>
                  {selectedReward.status}
                </span>
                <span className="text-sm text-gray-500">
                  • Required Level: {selectedReward.requiredLevel}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 text-center">
                {selectedReward.description}
              </p>
              
              <div className="w-full flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                >
                  Back to List
                </Button>
                
                {selectedReward.status === 'Available' && (
                  <Button
                    onClick={handleRedeem}
                  >
                    Redeem Now
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Rewards list view
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map(reward => (
                <div 
                  key={reward.id}
                  className={`
                    border rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]
                    ${reward.status === 'Redeemed' ? 'opacity-60' : ''}
                  `}
                  onClick={() => setSelectedReward(reward)}
                >
                  <div className="h-28 overflow-hidden">
                    <img 
                      src={reward.imageUrl} 
                      alt={reward.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-[#4B0082] mb-1">{reward.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Level {reward.requiredLevel}</span>
                      <span className={`text-xs font-medium ${getStatusColor(reward.status, reward.requiredLevel)}`}>
                        {reward.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;