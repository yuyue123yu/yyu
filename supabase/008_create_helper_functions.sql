-- =============================================
-- SUPER ADMIN SYSTEM: HELPER FUNCTIONS
-- Migration: 008_create_helper_functions
-- Description: Create helper functions for tenant context and audit logging
-- Requirements: Req 7 (Data Isolation), Req 8 (Audit Logging)
-- =============================================

-- This migration creates database functions that:
-- 1. Manage tenant context in session configuration
-- 2. Retrieve tenant_id for the current authenticated user
-- 3. Check if the current user is a super admin
-- 4. Log audit events for super admin actions
-- 5. Maintain accurate tenant user counts via triggers

-- =============================================
-- FUNCTION 1: get_tenant_id()
-- =============================================
-- Returns the current user's tenant_id from their profile
-- Used in RLS policies and application code

DO $$
BEGIN
  RAISE NOTICE 'Creating get_tenant_id() function...';
END $$;

CREATE OR REPLACE FUNCTION public.get_tenant_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  -- Get the authenticated user's ID
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Query the profiles table for the user's tenant_id
  SELECT tenant_id INTO user_tenant_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN user_tenant_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Return NULL if any error occurs (e.g., profile not found)
    RETURN NULL;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_tenant_id() IS 
  'Returns the tenant_id for the currently authenticated user. Returns NULL if user is not authenticated or profile not found.';

DO $$
BEGIN
  RAISE NOTICE '✓ get_tenant_id() function created';
END $$;

-- =============================================
-- FUNCTION 2: is_super_admin()
-- =============================================
-- Checks if the current user is a super admin
-- Used for authorization checks in application code

DO $$
BEGIN
  RAISE NOTICE 'Creating is_super_admin() function...';
END $$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
  is_sa BOOLEAN;
BEGIN
  -- Get the authenticated user's ID
  user_id := auth.uid();
  
  -- Return false if no authenticated user
  IF user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Query the profiles table for the super_admin flag
  SELECT super_admin INTO is_sa
  FROM public.profiles
  WHERE id = user_id;
  
  -- Return false if profile not found or super_admin is NULL
  RETURN COALESCE(is_sa, false);
EXCEPTION
  WHEN OTHERS THEN
    -- Return false if any error occurs
    RETURN false;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.is_super_admin() IS 
  'Returns true if the currently authenticated user has super_admin privileges, false otherwise.';

DO $$
BEGIN
  RAISE NOTICE '✓ is_super_admin() function created';
END $$;

-- =============================================
-- FUNCTION 3: log_audit_event()
-- =============================================
-- Logs an audit event to the audit_logs table
-- Used by backend API for all super admin actions

DO $$
BEGIN
  RAISE NOTICE 'Creating log_audit_event() function...';
END $$;

CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action_type TEXT,
  p_target_entity TEXT,
  p_target_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the authenticated user's ID
  current_user_id := auth.uid();
  
  -- Ensure user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Cannot log audit event: No authenticated user';
  END IF;
  
  -- Ensure user is a super admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Cannot log audit event: User is not a super admin';
  END IF;
  
  -- Combine old_data and new_data into changes JSONB
  DECLARE
    changes_data JSONB;
  BEGIN
    changes_data := jsonb_build_object(
      'old', p_old_data,
      'new', p_new_data
    );
  END;
  
  -- Insert the audit log entry
  INSERT INTO public.audit_logs (
    super_admin_id,
    action_type,
    target_entity,
    target_id,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    current_user_id,
    p_action_type,
    p_target_entity,
    p_target_id,
    jsonb_build_object('old', p_old_data, 'new', p_new_data),
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the operation
    RAISE WARNING 'Failed to log audit event: %', SQLERRM;
    RETURN NULL;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.log_audit_event(TEXT, TEXT, UUID, JSONB, JSONB, INET, TEXT) IS 
  'Logs an audit event for super admin actions. Parameters: action_type, target_entity, target_id (optional), old_data (optional), new_data (optional), ip_address (optional), user_agent (optional). Returns the audit log ID.';

DO $$
BEGIN
  RAISE NOTICE '✓ log_audit_event() function created';
END $$;

-- =============================================
-- FUNCTION 4: update_tenant_user_count()
-- =============================================
-- Trigger function to maintain accurate tenant user counts
-- Automatically updates tenants.user_count when profiles are inserted/updated/deleted

DO $$
BEGIN
  RAISE NOTICE 'Creating update_tenant_user_count() trigger function...';
END $$;

CREATE OR REPLACE FUNCTION public.update_tenant_user_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Handle INSERT: Increment user count for the new tenant
  IF TG_OP = 'INSERT' THEN
    IF NEW.tenant_id IS NOT NULL THEN
      UPDATE public.tenants
      SET user_count = user_count + 1,
          updated_at = NOW()
      WHERE id = NEW.tenant_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE: Decrement user count for the old tenant
  IF TG_OP = 'DELETE' THEN
    IF OLD.tenant_id IS NOT NULL THEN
      UPDATE public.tenants
      SET user_count = GREATEST(user_count - 1, 0),
          updated_at = NOW()
      WHERE id = OLD.tenant_id;
    END IF;
    RETURN OLD;
  END IF;
  
  -- Handle UPDATE: Adjust counts if tenant_id changed
  IF TG_OP = 'UPDATE' THEN
    -- If tenant_id changed from one tenant to another
    IF OLD.tenant_id IS DISTINCT FROM NEW.tenant_id THEN
      -- Decrement count for old tenant
      IF OLD.tenant_id IS NOT NULL THEN
        UPDATE public.tenants
        SET user_count = GREATEST(user_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.tenant_id;
      END IF;
      
      -- Increment count for new tenant
      IF NEW.tenant_id IS NOT NULL THEN
        UPDATE public.tenants
        SET user_count = user_count + 1,
            updated_at = NOW()
        WHERE id = NEW.tenant_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION public.update_tenant_user_count() IS 
  'Trigger function that maintains accurate user counts in the tenants table. Automatically updates user_count when profiles are inserted, updated, or deleted.';

DO $$
BEGIN
  RAISE NOTICE '✓ update_tenant_user_count() trigger function created';
END $$;

-- =============================================
-- TRIGGER: maintain_tenant_user_count
-- =============================================
-- Attach the trigger to the profiles table

DO $$
BEGIN
  RAISE NOTICE 'Creating maintain_tenant_user_count trigger...';
END $$;

-- Drop trigger if it already exists
DROP TRIGGER IF EXISTS maintain_tenant_user_count ON public.profiles;

-- Create the trigger
CREATE TRIGGER maintain_tenant_user_count
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tenant_user_count();

-- Add comment for documentation
COMMENT ON TRIGGER maintain_tenant_user_count ON public.profiles IS 
  'Maintains accurate tenant user counts by calling update_tenant_user_count() after profile changes.';

DO $$
BEGIN
  RAISE NOTICE '✓ maintain_tenant_user_count trigger created';
END $$;

-- =============================================
-- VALIDATION
-- =============================================

-- Verify all functions were created successfully
DO $$
DECLARE
  function_count INTEGER;
  trigger_count INTEGER;
BEGIN
  -- Count functions
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname IN (
    'get_tenant_id',
    'is_super_admin',
    'log_audit_event',
    'update_tenant_user_count'
  );
  
  IF function_count < 4 THEN
    RAISE EXCEPTION 'Expected 4 functions, but found only %', function_count;
  END IF;
  
  -- Count triggers
  SELECT COUNT(*) INTO trigger_count
  FROM pg_trigger
  WHERE tgname = 'maintain_tenant_user_count';
  
  IF trigger_count < 1 THEN
    RAISE EXCEPTION 'Expected 1 trigger, but found %', trigger_count;
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'HELPER FUNCTIONS MIGRATION COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ Created 4 database functions';
  RAISE NOTICE '✓ Created 1 trigger';
  RAISE NOTICE '';
  RAISE NOTICE 'Functions created:';
  RAISE NOTICE '  1. get_tenant_id()';
  RAISE NOTICE '     - Returns current user''s tenant_id';
  RAISE NOTICE '     - Used in RLS policies and application code';
  RAISE NOTICE '';
  RAISE NOTICE '  2. is_super_admin()';
  RAISE NOTICE '     - Checks if current user is a super admin';
  RAISE NOTICE '     - Used for authorization checks';
  RAISE NOTICE '';
  RAISE NOTICE '  3. log_audit_event()';
  RAISE NOTICE '     - Logs audit events for super admin actions';
  RAISE NOTICE '     - Parameters: action_type, target_entity, target_id,';
  RAISE NOTICE '       old_data, new_data, ip_address, user_agent';
  RAISE NOTICE '     - Returns audit log ID';
  RAISE NOTICE '';
  RAISE NOTICE '  4. update_tenant_user_count()';
  RAISE NOTICE '     - Trigger function to maintain tenant user counts';
  RAISE NOTICE '     - Automatically updates tenants.user_count';
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers created:';
  RAISE NOTICE '  1. maintain_tenant_user_count (on profiles table)';
  RAISE NOTICE '     - Fires on INSERT, UPDATE, DELETE';
  RAISE NOTICE '     - Keeps tenants.user_count accurate';
  RAISE NOTICE '';
  RAISE NOTICE 'Usage Examples:';
  RAISE NOTICE '';
  RAISE NOTICE '  -- Get current user''s tenant_id:';
  RAISE NOTICE '  SELECT public.get_tenant_id();';
  RAISE NOTICE '';
  RAISE NOTICE '  -- Check if current user is super admin:';
  RAISE NOTICE '  SELECT public.is_super_admin();';
  RAISE NOTICE '';
  RAISE NOTICE '  -- Log an audit event:';
  RAISE NOTICE '  SELECT public.log_audit_event(';
  RAISE NOTICE '    ''tenant.create'',';
  RAISE NOTICE '    ''tenants'',';
  RAISE NOTICE '    ''tenant-uuid-here'',';
  RAISE NOTICE '    NULL,';
  RAISE NOTICE '    ''{"name": "New Tenant"}''::jsonb,';
  RAISE NOTICE '    ''192.168.1.1''::inet,';
  RAISE NOTICE '    ''Mozilla/5.0...''';
  RAISE NOTICE '  );';
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Execute this migration in Supabase Dashboard';
  RAISE NOTICE '  2. Test get_tenant_id() with authenticated user';
  RAISE NOTICE '  3. Test is_super_admin() with super admin account';
  RAISE NOTICE '  4. Test log_audit_event() with super admin actions';
  RAISE NOTICE '  5. Verify trigger maintains user counts correctly';
  RAISE NOTICE '========================================';
END $$;
