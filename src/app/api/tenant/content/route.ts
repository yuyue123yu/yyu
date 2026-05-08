// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// GET - 获取内容管理配置
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '未登�? }, { status: 401 });
    }

    // 获取用户的租户信�?
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '用户未关联租�? }, { status: 400 });
    }

    // 获取内容管理配置
    const { data: settings, error } = await supabase
      .from('tenant_settings')
      .select('setting_value')
      .eq('tenant_id', profile.tenant_id)
      .eq('setting_key', 'content')
      .maybeSingle();

    if (error) {
      console.error('Error fetching content settings:', error);
      return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
    }

    // 返回默认值或已保存的设置
    const defaultContent = {
      // 首页横幅
      hero: {
        title: '专业法律咨询服务',
        subtitle: '为您提供全方位的法律支持与解决方�?,
        description: '我们拥有经验丰富的律师团队，致力于为客户提供高质量的法律服务。无论是个人法律问题还是企业法律事务，我们都能为您提供专业的建议和解决方案�?,
        cta_text: '立即咨询',
        cta_link: '/consultations',
        background_image: '',
      },
      
      // 服务介绍
      services: {
        title: '我们的服�?,
        subtitle: '专业、高效、值得信赖',
        items: [
          {
            title: '法律咨询',
            description: '提供专业的法律咨询服务，解答您的法律疑问',
            icon: 'MessageSquare',
          },
          {
            title: '合同审查',
            description: '专业审查各类合同，保障您的合法权�?,
            icon: 'FileText',
          },
          {
            title: '诉讼代理',
            description: '经验丰富的律师团队为您提供诉讼代理服�?,
            icon: 'Scale',
          },
          {
            title: '法律文书',
            description: '起草各类法律文书，确保文件的合法性和有效�?,
            icon: 'FileCheck',
          },
        ],
      },
      
      // 关于我们
      about: {
        title: '关于我们',
        subtitle: '专业的法律服务团�?,
        content: '我们是一家专业的法律服务机构，拥有多年的行业经验和优秀的律师团队。我们致力于为客户提供高质量、高效率的法律服务，帮助客户解决各类法律问题。\n\n我们的团队由资深律师组成，涵盖民事、商事、刑事等多个法律领域。我们秉�?专业、诚信、高�?的服务理念，为每一位客户提供量身定制的法律解决方案�?,
        mission: '为客户提供专业、高效、值得信赖的法律服�?,
        vision: '成为最受客户信赖的法律服务机构',
        values: ['专业', '诚信', '高效', '创新'],
        team_size: '20+',
        years_experience: '10+',
        cases_handled: '1000+',
        client_satisfaction: '98%',
      },
      
      // FAQ
      faq: {
        title: '常见问题',
        subtitle: '您可能想了解的问�?,
        items: [
          {
            question: '如何预约法律咨询�?,
            answer: '您可以通过我们的在线预约系统选择合适的时间和律师进行预约。预约成功后，我们会通过邮件或短信通知您�?,
          },
          {
            question: '咨询费用是多少？',
            answer: '我们提供不同级别的咨询服务，费用根据咨询类型和时长而定。您可以在价格页面查看详细的收费标准�?,
          },
          {
            question: '可以提供上门服务吗？',
            answer: '对于特殊情况，我们可以提供上门服务。具体请联系我们的客服人员进行咨询和安排�?,
          },
          {
            question: '咨询内容会保密吗�?,
            answer: '我们严格遵守律师职业道德和保密义务，所有咨询内容都会严格保密，不会向第三方透露�?,
          },
          {
            question: '如果对服务不满意怎么办？',
            answer: '我们重视每一位客户的反馈。如果您对我们的服务不满意，请及时联系我们，我们会尽快为您解决问题�?,
          },
        ],
      },
      
      // 页脚
      footer: {
        company_description: '专业的法律服务机构，为您提供全方位的法律支持与解决方案�?,
        contact: {
          address: '马来西亚吉隆�?,
          phone: '+60 12-345 6789',
          email: 'info@example.com',
          business_hours: '周一至周�?9:00-18:00',
        },
        links: {
          about: [
            { label: '关于我们', url: '/about' },
            { label: '律师团队', url: '/lawyers' },
            { label: '服务领域', url: '/services' },
            { label: '成功案例', url: '/cases' },
          ],
          services: [
            { label: '法律咨询', url: '/consultations' },
            { label: '合同审查', url: '/services/contracts' },
            { label: '诉讼代理', url: '/services/litigation' },
            { label: '法律文书', url: '/services/documents' },
          ],
          resources: [
            { label: '法律文章', url: '/articles' },
            { label: '常见问题', url: '/faq' },
            { label: '联系我们', url: '/contact' },
            { label: '隐私政策', url: '/privacy' },
          ],
        },
        copyright: '© 2024 版权所�?,
        show_social_links: true,
      },
    };

    return NextResponse.json({
      success: true,
      content: settings?.setting_value || defaultContent,
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenant/content:', error);
    return NextResponse.json({ error: '服务器错�? }, { status: 500 });
  }
}

// PUT - 更新内容管理配置
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    // 验证用户登录
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '未登�? }, { status: 401 });
    }

    // 获取用户的租户信息和权限
    const { data: profile } = await supabase
      .from('profiles')
      .select('tenant_id, user_type')
      .eq('id', session.user.id)
      .single();

    if (!profile?.tenant_id) {
      return NextResponse.json({ error: '用户未关联租�? }, { status: 400 });
    }

    // 检查权限：必须�?owner �?admin
    if (profile.user_type !== 'owner' && profile.user_type !== 'admin') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 });
    }

    // 获取请求数据
    const content = await request.json();

    // 保存或更新内容管理配�?
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({
        tenant_id: profile.tenant_id,
        setting_key: 'content',
        setting_value: content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'tenant_id,setting_key',
      });

    if (error) {
      console.error('Error updating content settings:', error);
      return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
    }

    // 记录审计日志
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'update_content',
      resource_type: 'tenant_settings',
      resource_id: profile.tenant_id,
      details: { sections: Object.keys(content) },
    });

    return NextResponse.json({
      success: true,
      message: '内容已保�?,
    });
  } catch (error: any) {
    console.error('Error in PUT /api/tenant/content:', error);
    return NextResponse.json({ error: '服务器错�? }, { status: 500 });
  }
}
