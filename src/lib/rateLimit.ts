/**
 * 简单的登录限流器
 * 防止暴力破解攻击
 * 
 * 生产环境建议使用 Redis 或 Upstash
 */

interface LoginAttempt {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// 内存存储（重启后清空）
const loginAttempts = new Map<string, LoginAttempt>();

// 配置
const MAX_ATTEMPTS = 5; // 最大尝试次数
const WINDOW_MS = 15 * 60 * 1000; // 15分钟窗口
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 封禁30分钟

/**
 * 检查是否允许登录尝试
 * @param identifier 用户标识（邮箱或IP）
 * @returns true 允许尝试，false 已被封禁
 */
export function checkLoginAttempts(identifier: string): {
  allowed: boolean;
  remainingAttempts?: number;
  blockedUntil?: Date;
} {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  // 首次尝试
  if (!attempts) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // 检查是否在封禁期
  if (attempts.blockedUntil && now < attempts.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: new Date(attempts.blockedUntil),
    };
  }

  // 窗口已过期，重置计数
  if (now > attempts.resetTime) {
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // 检查是否超过最大尝试次数
  if (attempts.count >= MAX_ATTEMPTS) {
    // 封禁用户
    attempts.blockedUntil = now + BLOCK_DURATION_MS;
    loginAttempts.set(identifier, attempts);
    
    console.warn(`[SECURITY] User blocked: ${identifier} - Too many login attempts`);
    
    return {
      allowed: false,
      blockedUntil: new Date(attempts.blockedUntil),
    };
  }

  // 增加尝试次数
  attempts.count++;
  loginAttempts.set(identifier, attempts);

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - attempts.count,
  };
}

/**
 * 登录成功后重置尝试次数
 * @param identifier 用户标识
 */
export function resetLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

/**
 * 获取剩余尝试次数
 * @param identifier 用户标识
 */
export function getRemainingAttempts(identifier: string): number {
  const attempts = loginAttempts.get(identifier);
  if (!attempts) return MAX_ATTEMPTS;
  
  const now = Date.now();
  if (now > attempts.resetTime) return MAX_ATTEMPTS;
  
  return Math.max(0, MAX_ATTEMPTS - attempts.count);
}

/**
 * 清理过期的记录（定期调用）
 */
export function cleanupExpiredAttempts(): void {
  const now = Date.now();
  for (const [identifier, attempts] of loginAttempts.entries()) {
    if (now > attempts.resetTime && (!attempts.blockedUntil || now > attempts.blockedUntil)) {
      loginAttempts.delete(identifier);
    }
  }
}

// 每小时清理一次过期记录
if (typeof window === 'undefined') {
  setInterval(cleanupExpiredAttempts, 60 * 60 * 1000);
}
