const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ovtrvzbftinsfwytzgwy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92dHJ2emJmdGluc2Z3eXR6Z3d5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc5NDcwOCwiZXhwIjoyMDkzMzcwNzA4fQ.VmaReeo6bcuIAtdnTbQFG4JshTg7roVrVGCJq8BqbXg',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function seedTestOrders() {
  console.log('🚀 开始添加测试订单数据...\n');

  // 获取测试用户ID
  const testUserId = '4d1be5e4-b929-47bf-97d6-15c09a1a589a';

  // 获取律师和服务数据
  const { data: lawyers } = await supabase.from('lawyers').select('id').limit(3);
  const { data: services } = await supabase.from('services').select('id').limit(3);

  if (!lawyers || lawyers.length === 0) {
    console.error('❌ 没有找到律师数据，请先运行 seed-data.js');
    return;
  }

  if (!services || services.length === 0) {
    console.error('❌ 没有找到服务数据，请先运行 seed-data.js');
    return;
  }

  console.log(`✅ 找到 ${lawyers.length} 个律师和 ${services.length} 个服务\n`);

  // 测试订单数据
  const testOrders = [
    {
      user_id: testUserId,
      lawyer_id: lawyers[0].id,
      service_id: services[0].id,
      amount: 500.00,
      currency: 'RM',
      status: 'paid',
      payment_method: 'credit_card',
      payment_id: 'pay_test_001',
    },
    {
      user_id: testUserId,
      lawyer_id: lawyers[1].id,
      service_id: services[1].id,
      amount: 800.00,
      currency: 'RM',
      status: 'paid',
      payment_method: 'online_banking',
      payment_id: 'pay_test_002',
    },
    {
      user_id: testUserId,
      lawyer_id: lawyers[2].id,
      service_id: services[2].id,
      amount: 1200.00,
      currency: 'RM',
      status: 'pending',
      payment_method: null,
      payment_id: null,
    },
    {
      user_id: testUserId,
      lawyer_id: lawyers[0].id,
      service_id: services[0].id,
      amount: 600.00,
      currency: 'RM',
      status: 'pending',
      payment_method: null,
      payment_id: null,
    },
    {
      user_id: testUserId,
      lawyer_id: lawyers[1].id,
      service_id: services[1].id,
      amount: 950.00,
      currency: 'RM',
      status: 'cancelled',
      payment_method: null,
      payment_id: null,
    },
    {
      user_id: testUserId,
      lawyer_id: lawyers[2].id,
      service_id: services[2].id,
      amount: 1500.00,
      currency: 'RM',
      status: 'refunded',
      payment_method: 'credit_card',
      payment_id: 'pay_test_006',
    },
  ];

  // 插入订单数据
  const { data, error } = await supabase
    .from('orders')
    .insert(testOrders)
    .select();

  if (error) {
    console.error('❌ 添加订单失败:', error);
    return;
  }

  console.log('✅ 成功添加测试订单数据！\n');
  console.log('📊 订单统计：');
  console.log(`   - 总订单数: ${data.length}`);
  console.log(`   - 已支付: ${data.filter(o => o.status === 'paid').length}`);
  console.log(`   - 待支付: ${data.filter(o => o.status === 'pending').length}`);
  console.log(`   - 已取消: ${data.filter(o => o.status === 'cancelled').length}`);
  console.log(`   - 已退款: ${data.filter(o => o.status === 'refunded').length}`);
  
  const totalRevenue = data
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.amount), 0);
  console.log(`   - 总收入: RM ${totalRevenue.toFixed(2)}\n`);

  console.log('📝 订单详情：');
  data.forEach((order, index) => {
    console.log(`   ${index + 1}. 订单 #${order.id.slice(0, 8)}`);
    console.log(`      金额: ${order.currency} ${order.amount}`);
    console.log(`      状态: ${order.status}`);
    console.log(`      支付方式: ${order.payment_method || '未指定'}\n`);
  });

  console.log('🎉 测试数据添加完成！');
  console.log('💡 现在可以访问 http://localhost:3000/admin/orders 查看订单');
}

seedTestOrders().catch(console.error);
