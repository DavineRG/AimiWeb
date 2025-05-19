import { User, Reward, Theme } from '../types';

export const mockUser: User = {
  id: '1',
  username: 'aimi_user',
  points: 25,
  level: 15,
  mobile: '+62123456789'
};

export const mockThemes: Theme[] = [
  {
    id: 1,
    name: 'Meadow Garden',
    startLevel: 1,
    endLevel: 10,
    backgroundImage: 'https://images.pexels.com/photos/1146708/pexels-photo-1146708.jpeg'
  },
  {
    id: 2,
    name: 'Carrot Farm',
    startLevel: 11,
    endLevel: 20,
    backgroundImage: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg'
  },
  {
    id: 3,
    name: 'Cherry Blossom',
    startLevel: 21,
    endLevel: 30,
    backgroundImage: 'https://images.pexels.com/photos/757889/pexels-photo-757889.jpeg'
  },
  {
    id: 4,
    name: 'Summer Meadow',
    startLevel: 31,
    endLevel: 40,
    backgroundImage: 'https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg'
  },
  {
    id: 5,
    name: 'Autumn Forest',
    startLevel: 41,
    endLevel: 50,
    backgroundImage: 'https://images.pexels.com/photos/1006121/pexels-photo-1006121.jpeg'
  }
];

export const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Exclusive Tote Bag',
    description: 'A beautiful, high-quality tote bag with the Aimi logo.',
    requiredLevel: 5,
    status: 'Redeemed',
    imageUrl: 'https://images.pexels.com/photos/5946706/pexels-photo-5946706.jpeg'
  },
  {
    id: '2',
    name: '10% Discount Voucher',
    description: 'Get 10% off your next purchase.',
    requiredLevel: 10,
    status: 'Available',
    imageUrl: 'https://images.pexels.com/photos/4386342/pexels-photo-4386342.jpeg'
  },
  {
    id: '3',
    name: 'Premium Makeup Kit',
    description: 'A collection of high-quality makeup products.',
    requiredLevel: 15,
    status: 'Available',
    imageUrl: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'
  },
  {
    id: '4',
    name: 'Fashion Consultation',
    description: 'A one-hour personal fashion consultation session.',
    requiredLevel: 20,
    status: 'Locked',
    imageUrl: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg'
  },
  {
    id: '5',
    name: 'Luxury Handbag',
    description: 'An elegant designer handbag for special occasions.',
    requiredLevel: 30,
    status: 'Locked',
    imageUrl: 'https://images.pexels.com/photos/10873788/pexels-photo-10873788.jpeg'
  }
];

export const generateLevels = () => {
  const levels = [];
  for (let i = 1; i <= 100; i++) {
    const theme = mockThemes.find(
      theme => i >= theme.startLevel && i <= theme.endLevel
    ) || mockThemes[0];
    
    const hasReward = i % 7 === 0; // Place rewards every 7 levels
    
    levels.push({
      level: i,
      themeId: theme.id,
      hasReward
    });
  }
  return levels;
};