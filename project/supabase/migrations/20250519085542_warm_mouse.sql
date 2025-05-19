/*
  # Initial Schema for Aimi Point Loyalty Program

  1. New Tables
    - `profiles`
      - Extends auth.users with additional user data
      - Stores points, level, and other user-specific information
    
    - `points_history`
      - Tracks all point transactions
      - Records purchase amounts and points earned
    
    - `rewards`
      - Defines available rewards
      - Includes level requirements and status
    
    - `user_rewards`
      - Links users to their claimed rewards
      - Tracks redemption status and dates
    
    - `themes`
      - Stores level theme information
      - Contains theme names and level ranges

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure access to sensitive data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  mobile_number text,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create points_history table
CREATE TABLE IF NOT EXISTS points_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  points_earned integer NOT NULL,
  purchase_amount numeric(12,2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  required_level integer NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_rewards table
CREATE TABLE IF NOT EXISTS user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'Available',
  redeemed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_level integer NOT NULL,
  end_level integer NOT NULL,
  background_image text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(start_level, end_level)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Points history policies
CREATE POLICY "Users can view own points history"
  ON points_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Anyone can view rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (true);

-- User rewards policies
CREATE POLICY "Users can view own rewards"
  ON user_rewards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim available rewards"
  ON user_rewards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Themes policies
CREATE POLICY "Anyone can view themes"
  ON themes
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update user points
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    points = points + NEW.points_earned,
    level = GREATEST(1, FLOOR(SQRT((points + NEW.points_earned) / 10)))
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for points update
CREATE TRIGGER on_points_earned
  AFTER INSERT ON points_history
  FOR EACH ROW
  EXECUTE FUNCTION update_user_points();