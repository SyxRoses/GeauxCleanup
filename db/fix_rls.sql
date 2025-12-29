-- Enable RLS on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to clean up
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;

-- Crate a policy that allows anyone (including anonymous users) to SELECT
CREATE POLICY "Services are viewable by everyone"
ON services FOR SELECT
USING (true);

-- Grant usage on schema public to anon and authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on services table to anon and authenticated
GRANT SELECT ON services TO anon, authenticated;
