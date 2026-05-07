-- Create Super Admin Account
-- This script sets up a super admin account for testing

-- Step 1: Check if the user exists in auth.users
-- You need to replace 'your-email@example.com' with your actual email

-- Step 2: Create or update profile for super admin
-- Replace the email with your actual email address
DO $$
DECLARE
  v_user_id UUID;
  v_email TEXT := 'test@example.com'; -- 修改为你的邮箱
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_email;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User with email % not found in auth.users', v_email;
    RAISE NOTICE 'Please create the user first through Supabase Auth UI or sign up';
  ELSE
    -- Check if profile exists
    IF EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
      -- Update existing profile
      UPDATE profiles
      SET 
        super_admin = true,
        user_type = 'admin',
        tenant_id = '00000000-0000-0000-0000-000000000001',
        updated_at = NOW()
      WHERE id = v_user_id;
      
      RAISE NOTICE 'Profile updated for user: % (ID: %)', v_email, v_user_id;
    ELSE
      -- Create new profile
      INSERT INTO profiles (
        id,
        email,
        user_type,
        super_admin,
        tenant_id,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        v_email,
        'admin',
        true,
        '00000000-0000-0000-0000-000000000001',
        NOW(),
        NOW()
      );
      
      RAISE NOTICE 'Profile created for user: % (ID: %)', v_email, v_user_id;
    END IF;
  END IF;
END $$;

-- Verify the super admin account
SELECT 
  id,
  email,
  user_type,
  super_admin,
  tenant_id,
  created_at
FROM profiles
WHERE super_admin = true;
