// 检查 settings 表的数据
// 在浏览器 Console 中运行此代码

async function checkSettings() {
  console.log("=== 开始检查设置 ===");
  
  try {
    // 导入 Supabase 客户端
    const { createClient } = await import('./src/lib/supabase/client.js');
    const supabase = await createClient();
    
    // 1. 检查 settings 表是否存在
    console.log("\n1. 查询 settings 表...");
    const { data: allSettings, error: allError } = await supabase
      .from('settings')
      .select('*');
    
    if (allError) {
      console.error("❌ 错误:", allError);
      return;
    }
    
    console.log("✅ settings 表数据:", allSettings);
    
    // 2. 检查 site 设置
    console.log("\n2. 查询 site 设置...");
    const { data: siteData, error: siteError } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'site')
      .single();
    
    if (siteError) {
      console.error("❌ 错误:", siteError);
    } else {
      console.log("✅ site 设置:", siteData);
      console.log("   网站名称:", siteData.value.siteName);
    }
    
    // 3. 检查当前用户
    console.log("\n3. 检查当前用户...");
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("❌ 错误:", userError);
    } else {
      console.log("✅ 当前用户:", user.email);
      console.log("   用户ID:", user.id);
    }
    
    // 4. 检查用户权限
    console.log("\n4. 检查用户权限...");
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error("❌ 错误:", profileError);
    } else {
      console.log("✅ 用户资料:", profile);
      console.log("   用户类型:", profile.user_type);
      console.log("   是否管理员:", profile.user_type === 'admin' ? '是' : '否');
    }
    
    console.log("\n=== 检查完成 ===");
    
  } catch (error) {
    console.error("❌ 发生错误:", error);
  }
}

// 运行检查
checkSettings();
