/*
  # Seed Initial Data with User Creation

  1. Content
    - Create test user if not exists
    - Add user profile
    - Add points history
    - Add rewards
    - Add themes
    
  2. Purpose
    - Set up demo account
    - Populate the database with initial content
    - Create sample rewards and themes
*/

-- Create a UUID variable for the test user and handle user creation
DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Check if the user already exists
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'demo@aimipoint.com';
  
  -- If user doesn't exist, create it
  IF test_user_id IS NULL THEN
    test_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
      test_user_id,
      'demo@aimipoint.com',
      crypt('demo123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;

  -- Delete existing profile data if it exists
  DELETE FROM profiles WHERE id = test_user_id;
  
  -- Insert or update profile
  INSERT INTO profiles (id, username, mobile_number, points, level)
  VALUES (
    test_user_id,
    'aimi_demo',
    '+62123456789',
    25,
    15
  );

  -- Clear existing points history
  DELETE FROM points_history WHERE user_id = test_user_id;
  
  -- Insert points history
  INSERT INTO points_history (user_id, points_earned, purchase_amount, description)
  VALUES
    (test_user_id, 5, 5000000, 'Welcome bonus'),
    (test_user_id, 10, 10000000, 'First purchase'),
    (test_user_id, 10, 10000000, 'Monthly shopping');

  -- Clear existing user rewards
  DELETE FROM user_rewards WHERE user_id = test_user_id;
  
  -- Insert rewards and user rewards
  WITH inserted_rewards AS (
    INSERT INTO rewards (name, description, required_level, image_url)
    VALUES
      ('Exclusive Tote Bag', 'A beautiful, high-quality tote bag with the Aimi logo.', 5, 'https://images.pexels.com/photos/5946706/pexels-photo-5946706.jpeg'),
      ('10% Discount Voucher', 'Get 10% off your next purchase.', 10, 'https://images.pexels.com/photos/4386342/pexels-photo-4386342.jpeg'),
      ('Premium Makeup Kit', 'A collection of high-quality makeup products.', 15, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'),
      ('Fashion Consultation', 'A one-hour personal fashion consultation session.', 20, 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg'),
      ('Luxury Handbag', 'An elegant designer handbag for special occasions.', 30, 'https://images.pexels.com/photos/10873788/pexels-photo-10873788.jpeg')
    ON CONFLICT DO NOTHING
    RETURNING id, required_level
  )
  -- Insert user rewards using the returned reward IDs
  INSERT INTO user_rewards (user_id, reward_id, status, redeemed_at)
  SELECT 
    test_user_id,
    id,
    CASE 
      WHEN required_level = 5 THEN 'Redeemed'::reward_status
      WHEN required_level IN (10, 15) THEN 'Available'::reward_status
      ELSE 'Locked'::reward_status
    END,
    CASE 
      WHEN required_level = 5 THEN now()
      ELSE null
    END
  FROM inserted_rewards;

END $$;

-- Clear existing themes
TRUNCATE themes CASCADE;

-- Insert themes
INSERT INTO themes (name, start_level, end_level, background_image)
VALUES
  ('Meadow Garden', 1, 10, 'https://images.pexels.com/photos/1146708/pexels-photo-1146708.jpeg'),
  ('Carrot Farm', 11, 20, 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg'),
  ('Cherry Blossom', 21, 30, 'https://images.pexels.com/photos/757889/pexels-photo-757889.jpeg'),
  ('Summer Meadow', 31, 40, 'https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg'),
  ('Autumn Forest', 41, 50, 'https://images.pexels.com/photos/1006121/pexels-photo-1006121.jpeg');