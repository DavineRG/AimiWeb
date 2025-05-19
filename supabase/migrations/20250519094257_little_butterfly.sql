/*
  # Add test data for development

  1. Content Added
    - Test user with authentication
    - Sample points history
    - Initial rewards
    - Theme data
    
  2. Purpose
    - Provide realistic test data
    - Enable frontend testing
    - Demonstrate functionality
*/

-- Insert test user (password: demo123)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  'test-user-id',
  'demo@aimipoint.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Insert test profile
INSERT INTO profiles (id, username, mobile_number, points, level)
VALUES (
  'test-user-id',
  'aimi_demo',
  '+62123456789',
  25,
  15
);

-- Insert points history
INSERT INTO points_history (user_id, points_earned, purchase_amount, description)
VALUES
  ('test-user-id', 5, 5000000, 'Welcome bonus'),
  ('test-user-id', 10, 10000000, 'First purchase'),
  ('test-user-id', 10, 10000000, 'Monthly shopping');

-- Insert rewards
INSERT INTO rewards (name, description, required_level, image_url)
VALUES
  ('Exclusive Tote Bag', 'A beautiful, high-quality tote bag with the Aimi logo.', 5, 'https://images.pexels.com/photos/5946706/pexels-photo-5946706.jpeg'),
  ('10% Discount Voucher', 'Get 10% off your next purchase.', 10, 'https://images.pexels.com/photos/4386342/pexels-photo-4386342.jpeg'),
  ('Premium Makeup Kit', 'A collection of high-quality makeup products.', 15, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg'),
  ('Fashion Consultation', 'A one-hour personal fashion consultation session.', 20, 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg'),
  ('Luxury Handbag', 'An elegant designer handbag for special occasions.', 30, 'https://images.pexels.com/photos/10873788/pexels-photo-10873788.jpeg');

-- Insert themes
INSERT INTO themes (name, start_level, end_level, background_image)
VALUES
  ('Meadow Garden', 1, 10, 'https://images.pexels.com/photos/1146708/pexels-photo-1146708.jpeg'),
  ('Carrot Farm', 11, 20, 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg'),
  ('Cherry Blossom', 21, 30, 'https://images.pexels.com/photos/757889/pexels-photo-757889.jpeg'),
  ('Summer Meadow', 31, 40, 'https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg'),
  ('Autumn Forest', 41, 50, 'https://images.pexels.com/photos/1006121/pexels-photo-1006121.jpeg');

-- Insert user rewards (some redeemed, some available)
INSERT INTO user_rewards (user_id, reward_id, status, redeemed_at)
VALUES
  ('test-user-id', (SELECT id FROM rewards WHERE required_level = 5), 'Redeemed', now()),
  ('test-user-id', (SELECT id FROM rewards WHERE required_level = 10), 'Available', null),
  ('test-user-id', (SELECT id FROM rewards WHERE required_level = 15), 'Available', null);