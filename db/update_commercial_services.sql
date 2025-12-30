-- Update services table to only have 4 commercial/office services
-- First, clear existing services to start fresh

DELETE FROM services;

-- Insert the 4 commercial-only services with LOCAL images
INSERT INTO services (name, description, base_price, image_url, duration_minutes) VALUES
  (
    'Office Maintenance',
    'Daily or weekly cleaning for professional workspaces. Includes trash removal, vacuuming, mopping, dusting, and restroom sanitation.',
    200.00,
    '/images/service-office-maintenance.png',
    120
  ),
  (
    'Corporate Deep Clean',
    'Comprehensive detailed cleaning for offices. Includes windows, breakrooms, conference rooms, and all common areas.',
    450.00,
    '/images/service-corporate-deep-clean.png',
    240
  ),
  (
    'Commercial Floor Care',
    'Professional floor maintenance including stripping, waxing, buffing, and high-traffic area restoration.',
    300.00,
    '/images/service-commercial-floor-care.png',
    180
  ),
  (
    'Post-Construction Cleanup',
    'Heavy-duty site cleanup for renovated or newly built commercial spaces. Debris removal, fine dust elimination, and move-in ready finish.',
    600.00,
    '/images/service-post-construction.png',
    480
  );

-- Verify the services
SELECT id, name, base_price, duration_minutes FROM services ORDER BY base_price;
