-- =============================================
-- 创建密码重置历史表
-- Migration: 012_create_password_reset_history
-- =============================================

-- 1. 创建密码重置历史表
-- =============================================

CREATE TABLE IF NOT EXISTS public.password_reset_history (
  -- Primary key
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- User reference
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Reset information
  reset_method TEXT NOT NULL CHECK (reset_method IN ('email', 'admin', 'self')),
  reset_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Security tracking
  ip_address TEXT,
  user_agent TEXT,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. 添加索引
-- =============================================

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_history_user_id 
  ON public.password_reset_history(user_id);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_password_reset_history_created_at 
  ON public.password_reset_history(created_at DESC);

-- Index for reset method filtering
CREATE INDEX IF NOT EXISTS idx_password_reset_history_reset_method 
  ON public.password_reset_history(reset_method);

-- Composite index for user + time queries
CREATE INDEX IF NOT EXISTS idx_password_reset_history_user_time 
  ON public.password_reset_history(user_id, created_at DESC);

-- 3. 启用 RLS
-- =============================================

ALTER TABLE public.password_reset_history ENABLE ROW LEVEL SECURITY;

-- 4. RLS 策略
-- =============================================

-- 用户可以查看自己的密码重置历史
CREATE POLICY "Users can view own password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Super Admin 可以查看所有密码重置历史
CREATE POLICY "Super admins can view all password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND super_admin = true
    )
  );

-- 租户管理员可以查看自己租户的密码重置历史
CREATE POLICY "Tenant admins can view tenant password reset history"
  ON public.password_reset_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1
      JOIN public.profiles p2 ON p1.tenant_id = p2.tenant_id
      WHERE p1.id = auth.uid() 
      AND p1.role IN ('owner', 'admin')
      AND p2.id = password_reset_history.user_id
    )
  );

-- 系统可以插入密码重置记录
CREATE POLICY "Authenticated users can insert password reset history"
  ON public.password_reset_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 5. 添加注释
-- =============================================

COMMENT ON TABLE public.password_reset_history IS 
  '密码重置历史记录，用于安全审计和追踪';

COMMENT ON COLUMN public.password_reset_history.id IS 
  '唯一标识符';

COMMENT ON COLUMN public.password_reset_history.user_id IS 
  '密码被重置的用户ID';

COMMENT ON COLUMN public.password_reset_history.reset_method IS 
  '重置方式：email(邮件重置), admin(管理员重置), self(用户自己修改)';

COMMENT ON COLUMN public.password_reset_history.reset_by IS 
  '执行重置的管理员ID（仅当reset_method=admin时有值）';

COMMENT ON COLUMN public.password_reset_history.ip_address IS 
  '请求来源IP地址';

COMMENT ON COLUMN public.password_reset_history.user_agent IS 
  '请求来源User-Agent';

COMMENT ON COLUMN public.password_reset_history.created_at IS 
  '重置时间';

-- 6. 创建辅助函数
-- =============================================

-- 检查用户最近的密码重置次数（防止滥用）
CREATE OR REPLACE FUNCTION check_password_reset_rate_limit(
  p_user_id UUID,
  p_time_window INTERVAL DEFAULT '1 hour',
  p_max_attempts INTEGER DEFAULT 3
)
RETURNS BOOLEAN AS $$
DECLARE
  v_attempt_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_attempt_count
  FROM public.password_reset_history
  WHERE user_id = p_user_id
  AND created_at > NOW() - p_time_window;
  
  RETURN v_attempt_count < p_max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_password_reset_rate_limit IS 
  '检查用户是否超过密码重置频率限制';

-- 7. 验证
-- =============================================

DO $
BEGIN
  -- 验证表已创建
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'password_reset_history'
  ) THEN
    RAISE EXCEPTION 'Failed to create password_reset_history table';
  END IF;
  
  -- 验证 RLS 已启用
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'password_reset_history' 
    AND rowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS not enabled on password_reset_history table';
  END IF;
  
  RAISE NOTICE 'Password reset history table created successfully';
END $;
