-- ============================================================
-- FIX: User Creation Trigger for App Schema
-- ============================================================
-- The issue: The trigger was inserting into public.users 
-- but your tables are in the 'app' schema.
-- This script fixes the trigger to insert into app.users.

-- 1. Drop the old trigger (if it exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the old function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Create the corrected function that inserts into app.users
CREATE OR REPLACE FUNCTION app.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO app.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent errors if user already exists
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger to call the function on new signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION app.handle_new_user();

-- 5. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION app.handle_new_user() TO service_role;

-- 6. Backfill any existing auth users that are missing from app.users
INSERT INTO app.users (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'New User'),
  COALESCE(raw_user_meta_data->>'role', 'customer')
FROM auth.users
WHERE id NOT IN (SELECT id FROM app.users)
ON CONFLICT (id) DO NOTHING;

-- 7. Verify the fix - check the trigger exists
SELECT tgname, tgrelid::regclass, tgfoid::regproc
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- 8. Show current users in app.users
SELECT id, email, full_name, role FROM app.users;
