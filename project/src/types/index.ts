export interface User {
  id: string;
  username: string;
  points: number;
  level: number;
  mobile: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  status: 'Locked' | 'Available' | 'Redeemed';
  imageUrl: string;
}

export interface Theme {
  id: number;
  name: string;
  startLevel: number;
  endLevel: number;
  backgroundImage: string;
}