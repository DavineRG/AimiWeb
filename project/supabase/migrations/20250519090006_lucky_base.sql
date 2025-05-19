/*
  # Schema Enhancements for Aimi Point

  1. New Tables
    - levels: Defines point requirements for each level
    - activity_types: Standardizes activities and point values
    - reward_categories: Categorizes different types of rewards
    - reward_inventory: Tracks reward stock and availability

  2. Enhancements
    - Add enum type for reward status
    - Add constraints and indexes for data integrity
    - Add audit fields for tracking
*/

-- Create enum for reward status
CREATE TYPE reward_status AS ENUM ('Unavailable', 'Available', 'Redeemed');

-- Create levels table
CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  points_required integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  CHECK (level_number > 0),
  CHECK (points_required > 0)
);

-- Create activity_types table
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  points_value integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (points_value >= 0)
);

-- Create reward_categories table
CREATE TABLE IF NOT EXISTS reward_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reward_inventory table
CREATE TABLE IF NOT EXISTS reward_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id uuid REFERENCES rewards(id) ON DELETE CASCADE NOT NULL,
  total_quantity integer NOT NULL,
  remaining_quantity integer NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (total_quantity >= 0),
  CHECK (remaining_quantity >= 0),
  CHECK (remaining_quantity <= total_quantity),
  CHECK (start_date <= end_date)
);

-- Add category_id to rewards table
ALTER TABLE rewards 
ADD COLUMN category_id uuid REFERENCES reward_categories(id),
ADD COLUMN is_limited_quantity boolean DEFAULT false;

-- Convert status in user_rewards to use enum
ALTER TABLE user_rewards
ALTER COLUMN status TYPE reward_status USING status::reward_status;

-- Add validation trigger for points_history
CREATE OR REPLACE FUNCTION validate_points_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent negative points
  IF NEW.points_earned < 0 THEN
    RAISE EXCEPTION 'Points earned cannot be negative';
  END IF;
  
  -- Prevent duplicate entries for same purchase
  IF EXISTS (
    SELECT 1 FROM points_history 
    WHERE user_id = NEW.user_id 
    AND purchase_amount = NEW.purchase_amount 
    AND created_at = NEW.created_at
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'Duplicate point entry detected';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_points_history_trigger
  BEFORE INSERT OR UPDATE ON points_history
  FOR EACH ROW
  EXECUTE FUNCTION validate_points_history();

-- Add validation trigger for user_rewards
CREATE OR REPLACE FUNCTION validate_reward_claim()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has required level
  IF NOT EXISTS (
    SELECT 1 FROM profiles p
    JOIN rewards r ON NEW.reward_id = r.id
    WHERE p.id = NEW.user_id
    AND p.level >= r.required_level
  ) THEN
    RAISE EXCEPTION 'User does not meet the level requirement for this reward';
  END IF;
  
  -- Check if reward is in stock (if limited quantity)
  IF EXISTS (
    SELECT 1 FROM rewards r
    JOIN reward_inventory ri ON r.id = ri.reward_id
    WHERE r.id = NEW.reward_id
    AND r.is_limited_quantity = true
    AND ri.remaining_quantity <= 0
  ) THEN
    RAISE EXCEPTION 'Reward is out of stock';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_reward_claim_trigger
  BEFORE INSERT ON user_rewards
  FOR EACH ROW
  EXECUTE FUNCTION validate_reward_claim();

-- Add indexes for performance
CREATE INDEX idx_points_history_user_id ON points_history(user_id);
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_themes_level_range ON themes(start_level, end_level);

-- Enable RLS on new tables
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_inventory ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY "Anyone can view levels"
  ON levels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view activity types"
  ON activity_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view reward categories"
  ON reward_categories FOR SELECT
  TO authenticated
  USING (true);

-- Seed initial data for levels (using square root formula)
INSERT INTO levels (level_number, points_required)
SELECT 
  level_number,
  (level_number * level_number * 10) as points_required
FROM generate_series(1, 100) as level_number;

-- Seed initial activity types
INSERT INTO activity_types (name, points_value) VALUES
  ('Purchase', 1),  -- 1 point per 1,000,000 IDR
  ('Welcome Bonus', 5),
  ('First Purchase', 10),
  ('Monthly Active User', 3),
  ('Special Event', 5);

-- Seed initial reward categories
INSERT INTO reward_categories (name, description) VALUES
  ('Accessories', 'Fashion accessories and bags'),
  ('Discounts', 'Special discounts and vouchers'),
  ('Beauty', 'Makeup and beauty products'),
  ('Services', 'Consultation and special services'),
  ('Premium', 'High-end fashion items');

-- Update existing rewards with categories
UPDATE rewards SET category_id = (
  SELECT id FROM reward_categories WHERE name = 'Accessories'
) WHERE name LIKE '%Bag%';

UPDATE rewards SET category_id = (
  SELECT id FROM reward_categories WHERE name = 'Discounts'
) WHERE name LIKE '%Discount%';

UPDATE rewards SET category_id = (
  SELECT id FROM reward_categories WHERE name = 'Beauty'
) WHERE name LIKE '%Makeup%';

UPDATE rewards SET category_id = (
  SELECT id FROM reward_categories WHERE name = 'Services'
) WHERE name LIKE '%Consultation%';

UPDATE rewards SET category_id = (
  SELECT id FROM reward_categories WHERE name = 'Premium'
) WHERE name LIKE '%Luxury%';