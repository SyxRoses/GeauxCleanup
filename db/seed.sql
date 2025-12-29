-- Seed Data for Boudreaux's Cleaning (Commercial Services Only)
-- Run this AFTER running schema.sql

-- Insert Commercial Services
INSERT INTO services (name, description, base_price, image_url, duration_minutes) VALUES
  ('Office Maintenance', 'Daily or weekly cleaning for professional workspaces. Trash removal, vacuuming, and restroom sanitation.', 200.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 120),
  ('Commercial Floor Care', 'Stripping, waxing, buffing, and high-traffic maintenance for commercial spaces.', 300.00, 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&h=600&fit=crop', 180),
  ('Post-Construction', 'Heavy-duty site cleanup for renovated commercial spaces. Debris removal and fine dust elimination.', 600.00, '/images/service-post-construction.png', 480)
ON CONFLICT DO NOTHING;

