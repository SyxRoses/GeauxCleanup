-- Remove duplicate services from the database
-- This keeps only the oldest entry of each service name (works with UUID ids)

-- First, let's see what duplicates exist
SELECT name, COUNT(*) as count 
FROM services 
GROUP BY name 
HAVING COUNT(*) > 1;

-- Delete duplicates, keeping the oldest entry (earliest created_at) of each service name
DELETE FROM services
WHERE id IN (
    SELECT id FROM (
        SELECT id, 
               ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as rn
        FROM services
    ) ranked
    WHERE rn > 1
);

-- Verify the cleanup - should show unique services only
SELECT id, name, base_price, created_at FROM services ORDER BY base_price;

-- Optional: Add a unique constraint to prevent duplicates in the future
-- ALTER TABLE services ADD CONSTRAINT services_name_unique UNIQUE (name);
