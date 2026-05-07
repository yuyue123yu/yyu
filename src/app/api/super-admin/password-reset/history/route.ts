// Password Reset History API
import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/middleware/super-admin';
import { getPasswordResetHistory } from '@/lib/auth/password-reset';

/**
 * GET /api/super-admin/password-reset/history?user_id=xxx&page=1&limit=10
 * View password reset history for a user
 */
export async function GET(request: NextRequest) {
  // Verify super admin authentication
  const authResult = await requireSuperAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Get password reset history
    const history = await getPasswordResetHistory(user_id, page, limit);

    return NextResponse.json({
      success: true,
      ...history,
    });
  } catch (error) {
    console.error('Error fetching password reset history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch password reset history' },
      { status: 500 }
    );
  }
}
