-- Seed Data for Boudreaux's Cleaning
-- Run this AFTER running schema.sql

-- Insert Services
INSERT INTO services (name, description, base_price, image_url, duration_minutes) VALUES
  ('Standard Clean', 'Perfect for maintaining a tidy home. Dusting, vacuuming, mopping, and bathroom sanitation.', 120.00, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop', 120),
  ('Deep Clean', 'A thorough top-to-bottom clean. Includes inside oven, baseboards, and window sills.', 250.00, 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&h=600&fit=crop', 240),
  ('Move-In/Out', 'Empty home cleaning ensuring you get your deposit back or welcome new tenants.', 350.00, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', 360),
  ('Post-Construction', 'Specialized cleaning after renovations. Dust removal, debris cleanup, and detailed finishing.', 450.00, 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?w=800&h=600&fit=crop', 300),
  ('Office Cleaning', 'Professional workspace cleaning. Desks, common areas, restrooms, and kitchen facilities.', 180.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', 150)
ON CONFLICT DO NOTHING;
