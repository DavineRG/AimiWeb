import React, { useRef, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { mockThemes } from '../../data/mockData';

interface LevelPathProps {
  currentLevel: number;
  onLevelClick: (level: number) => void;
}

const LevelPath: React.FC<LevelPathProps> = ({ currentLevel, onLevelClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate levels from 1 to 100
  const levels = Array.from({ length: 100 }, (_, i) => i + 1);
  
  // Get the appropriate theme for a level
  const getThemeForLevel = (level: number) => {
    return mockThemes.find(
      theme => level >= theme.startLevel && level <= theme.endLevel
    ) || mockThemes[0];
  };
  
  // Check if a level has a reward
  const hasReward = (level: number) => {
    return level % 7 === 0; // Every 7th level has a reward
  };
  
  // Scroll to current level when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const levelElement = document.getElementById(`level-${currentLevel}`);
      if (levelElement) {
        // Calculate position to center the current level
        const containerWidth = containerRef.current.offsetWidth;
        const levelPosition = levelElement.offsetLeft;
        containerRef.current.scrollLeft = levelPosition - containerWidth / 2 + 25;
      }
    }
  }, [currentLevel]);
  
  return (
    <div 
      ref={containerRef}
      className="w-full overflow-x-auto pb-4 hide-scrollbar"
      style={{ overscrollBehavior: 'contain' }}
    >
      <div className="w-max flex items-center px-4 py-8">
        {/* The level path */}
        <div className="relative flex items-center">
          <div className="absolute top-0 left-0 right-0 h-4 bg-[#A67B5B] z-0 rounded-full" />
          
          {levels.map(level => {
            const theme = getThemeForLevel(level);
            const isCurrentLevel = level === currentLevel;
            const isPastLevel = level < currentLevel;
            const hasLevelReward = hasReward(level);
            
            return (
              <div 
                key={level}
                id={`level-${level}`}
                className={`
                  relative z-10 mx-1 flex flex-col items-center 
                  ${isCurrentLevel ? 'scale-125 z-20' : ''}
                  ${isPastLevel ? 'opacity-70' : ''}
                `}
                onClick={() => onLevelClick(level)}
              >
                {/* Level marker */}
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1
                    ${isCurrentLevel 
                      ? 'bg-[#FF69B4] text-white ring-4 ring-[#FFC0CB] shadow-lg' 
                      : isPastLevel 
                        ? 'bg-[#FFC0CB] text-[#4B0082]' 
                        : 'bg-white text-[#4B0082] border-2 border-[#A67B5B]'
                    }
                  `}
                >
                  {level}
                </div>
                
                {/* Show reward marker if level has reward */}
                {hasLevelReward && (
                  <div className={`
                    absolute -top-12 
                    ${isCurrentLevel ? 'animate-bounce' : ''}
                  `}>
                    <div className="relative">
                      <Gift 
                        size={24} 
                        className={`
                          ${isPastLevel ? 'text-gray-400' : 'text-[#FF69B4]'}
                        `} 
                      />
                      {isCurrentLevel && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Theme label for first level in each theme */}
                {theme.startLevel === level && (
                  <div className="absolute -bottom-8 whitespace-nowrap text-xs font-medium text-[#4B0082]">
                    {theme.name}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Bunny character at current level */}
          <div 
            className="absolute z-30"
            style={{ 
              left: `${(currentLevel - 1) * 48 + 12}px`,
              bottom: '-30px',
              transition: 'left 1s ease-in-out'
            }}
          >
            <div className="w-10 h-14 bg-[#FFC0CB] rounded-t-full relative">
              {/* Bunny ears */}
              <div className="absolute -top-6 left-0 w-2 h-6 bg-[#FFC0CB] rounded-full transform -rotate-15"></div>
              <div className="absolute -top-6 right-0 w-2 h-6 bg-[#FFC0CB] rounded-full transform rotate-15"></div>
              
              {/* Bunny face */}
              <div className="absolute top-2 left-1.5 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-2 right-1.5 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-4 left-3 w-4 h-2 bg-pink-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelPath;