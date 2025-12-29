
-- Insert Commercial Services
INSERT INTO services (name, description, base_price, image_url, duration_minutes) VALUES
  ('Office Basic', 'Essential cleaning: Trash, vacuuming, mopping, and restrooms.', 200.00, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 120),
  ('Corporate Deep Clean', 'Comprehensive detailed cleaning including windows and breakrooms.', 450.00, 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', 240),
  ('Commercial Floor Care', 'Stripping, waxing, buffing, and high-traffic maintenance.', 300.00, 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80', 180)
ON CONFLICT DO NOTHING;
