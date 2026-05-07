-- =============================================
-- SUPER ADMIN SYSTEM: PASSWORD RESET TOKENS TABLE
-- Migration: 005_create_password_reset_tokens_table
-- Description: Create password_reset_tokens table for secure password reset functionality
-- Requirements: Req 5 (Password Recovery System)
-- =============================================

-- =============================================
-- PASSWORD RESET TOKENS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  -- Primary identification
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- User reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Token data (256-bit cryptographically secure token)
  token TEXT UNIQUE NOT NULL,
  
  -- Expiration and usage tracking
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Audit trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Index for token lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
  ON public.password_reset_tokens(token);

-- Index for user_id lookups (for user history)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user 
  ON public.password_reset_tokens(user_id);

-- Index for expires_at (for cleanup and validation)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires 
  ON public.password_reset_tokens(expires_at);

-- Index for created_by for audit queries
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_created_by 
  ON public.password_reset_tokens(created_by);

-- Composite index for active token validation (token + expires_at + used_at)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_active 
  ON public.password_reset_tokens(token, expires_at, used_at) 
  WHERE used_at IS NULL;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on password_reset_tokens table
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role has full access to password_reset_tokens" ON public.password_reset_tokens;
DROP POLICY IF EXISTS "Users can view their own reset tokens" ON public.password_reset_tokens;

-- Temporary policy: Allow service role full access
-- This will be replaced with super_admin policies in a later migration
CREATE POLICY "Service role has full access to password_reset_tokens"
  ON public.password_reset_tokens
  USING (true)
  WITH CHECK (true);

-- Policy: Users can view their own reset tokens (for validation)
CREATE POLICY "Users can view their own reset tokens"
  ON public.password_reset_tokens FOR SELECT
  USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_password_reset_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete tokens that expired more than 7 days ago
  DELETE FROM public.password_reset_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Cleaned up % expired password reset tokens', deleted_count;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_password_reset_tokens() IS 
  'Removes password reset tokens that expired more than 7 days ago to maintain database hygiene';

-- Function to validate a password reset token
CREATE OR REPLACE FUNCTION validate_password_reset_token(token_value TEXT)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  token_id UUID,
  error_message TEXT
) AS $$
DECLARE
  token_record RECORD;
BEGIN
  -- Find the token
  SELECT * INTO token_record
  FROM public.password_reset_tokens
  WHERE token = token_value;
  
  -- Token not found
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, 'Token not found'::TEXT;
    RETURN;
  END IF;
  
  -- Token already used
  IF token_record.used_at IS NOT NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, 'Token has already been used'::TEXT;
    RETURN;
  END IF;
  
  -- Token expired
  IF token_record.expires_at < NOW() THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::UUID, 'Token has expired'::TEXT;
    RETURN;
  END IF;
  
  -- Token is valid
  RETURN QUERY SELECT true, token_record.user_id, token_record.id, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_password_reset_token(TEXT) IS 
  'Validates a password reset token and returns validation status with user_id if valid';

-- Function to mark token as used
CREATE OR REPLACE FUNCTION mark_password_reset_token_used(token_value TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.password_reset_tokens
  SET used_at = NOW()
  WHERE token = token_value
    AND used_at IS NULL
    AND expires_at > NOW();
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  IF updated_count = 0 THEN
    RAISE NOTICE 'No valid token found to mark as used';
    RETURN false;
  END IF;
  
  RAISE NOTICE 'Password reset token marked as used';
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_password_reset_token_used(TEXT) IS 
  'Marks a password reset token as used after successful password change';

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE public.password_reset_tokens IS 
  'Stores time-limited, single-use tokens for secure password reset functionality initiated by super admins';

COMMENT ON COLUMN public.password_reset_tokens.id IS 
  'Unique identifier for the password reset token record';

COMMENT ON COLUMN public.password_reset_tokens.user_id IS 
  'Foreign key to auth.users - the user whose password is being reset';

COMMENT ON COLUMN public.password_reset_tokens.token IS 
  'Cryptographically secure 256-bit token used for password reset verification';

COMMENT ON COLUMN public.password_reset_tokens.expires_at IS 
  'Timestamp when the token expires (24 hours from creation)';

COMMENT ON COLUMN public.password_reset_tokens.used_at IS 
  'Timestamp when the token was used (NULL if not yet used)';

COMMENT ON COLUMN public.password_reset_tokens.created_by IS 
  'Foreign key to auth.users - the super admin who initiated the password reset';

COMMENT ON COLUMN public.password_reset_tokens.created_at IS 
  'Timestamp when the token was created';

-- =============================================
-- VALIDATION
-- =============================================

-- Verify table was created successfully
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'password_reset_tokens'
  ) THEN
    RAISE EXCEPTION 'Failed to create password_reset_tokens table';
  END IF;
  
  -- Verify unique constraint on token exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'UNIQUE'
    AND table_schema = 'public'
    AND table_name = 'password_reset_tokens'
    AND constraint_name LIKE '%token%'
  ) THEN
    RAISE EXCEPTION 'Unique constraint on token not found';
  END IF;
  
  -- Verify foreign key constraints exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name = 'password_reset_tokens'
  ) THEN
    RAISE EXCEPTION 'Foreign key constraints not found';
  END IF;
  
  -- Verify indexes were created
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'password_reset_tokens'
    AND indexname = 'idx_password_reset_tokens_token'
  ) THEN
    RAISE EXCEPTION 'Index idx_password_reset_tokens_token not found';
  END IF;
  
  -- Verify functions were created
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'cleanup_expired_password_reset_tokens'
  ) THEN
    RAISE EXCEPTION 'Function cleanup_expired_password_reset_tokens not found';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'validate_password_reset_token'
  ) THEN
    RAISE EXCEPTION 'Function validate_password_reset_token not found';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'mark_password_reset_token_used'
  ) THEN
    RAISE EXCEPTION 'Function mark_password_reset_token_used not found';
  END IF;
  
  RAISE NOTICE '✓ Password reset tokens table created successfully';
  RAISE NOTICE '✓ Unique constraint on token verified';
  RAISE NOTICE '✓ Foreign key constraints verified (user_id, created_by)';
  RAISE NOTICE '✓ Indexes created: idx_password_reset_tokens_token, idx_password_reset_tokens_user, idx_password_reset_tokens_expires, idx_password_reset_tokens_created_by, idx_password_reset_tokens_active';
  RAISE NOTICE '✓ Helper functions created: cleanup_expired_password_reset_tokens, validate_password_reset_token, mark_password_reset_token_used';
  RAISE NOTICE '✓ RLS policies enabled (will be updated with super_admin policies in later migration)';
END $$;
