"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setLoading(true);
    const supabase = await createClient();

    try {
      addResult("=== 开始诊断 ===\n");

      // 1. 检查当前用户
      addResult("1️⃣ 检查当前用户...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        addResult(`❌ 获取用户失败: ${userError.message}`);
      } else {
        addResult(`✅ 当前用户: ${user?.email}`);
        addResult(`   用户ID: ${user?.id}`);
      }

      // 2. 检查用户权限
      if (user) {
        addResult("\n2️⃣ 检查用户权限...");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          addResult(`❌ 获取用户资料失败: ${profileError.message}`);
        } else {
          addResult(`✅ 用户类型: ${profile?.user_type}`);
          addResult(`   是否管理员: ${profile?.user_type === 'admin' ? '是' : '否'}`);
        }
      }

      // 3. 检查 settings 表
      addResult("\n3️⃣ 检查 settings 表...");
      const { data: allSettings, error: settingsError } = await supabase
        .from('settings')
        .select('*');

      if (settingsError) {
        addResult(`❌ 查询 settings 表失败: ${settingsError.message}`);
        addResult(`   错误代码: ${settingsError.code}`);
        addResult(`   错误详情: ${settingsError.details}`);
      } else {
        addResult(`✅ settings 表存在，共 ${allSettings?.length || 0} 条记录`);
        if (allSettings && allSettings.length > 0) {
          allSettings.forEach(setting => {
            addResult(`   - ${setting.key}: ${JSON.stringify(setting.value).substring(0, 50)}...`);
          });
        }
      }

      // 4. 检查 site 设置
      addResult("\n4️⃣ 检查 site 设置...");
      const { data: siteData, error: siteError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'site')
        .single();

      if (siteError) {
        addResult(`❌ 查询 site 设置失败: ${siteError.message}`);
      } else {
        addResult(`✅ site 设置存在`);
        addResult(`   网站名称: ${siteData?.value?.siteName || '未设置'}`);
        addResult(`   完整数据: ${JSON.stringify(siteData?.value, null, 2)}`);
      }

      // 5. 测试保存权限
      addResult("\n5️⃣ 测试保存权限...");
      const { data: testData, error: testError } = await supabase
        .from('settings')
        .upsert({
          key: 'test_debug',
          value: { test: true, timestamp: new Date().toISOString() }
        }, { onConflict: 'key' });

      if (testError) {
        addResult(`❌ 保存测试失败: ${testError.message}`);
        addResult(`   错误代码: ${testError.code}`);
        addResult(`   这可能是权限问题！`);
      } else {
        addResult(`✅ 保存测试成功`);
        
        // 清理测试数据
        await supabase.from('settings').delete().eq('key', 'test_debug');
        addResult(`   已清理测试数据`);
      }

      // 6. 测试更新 site 设置
      addResult("\n6️⃣ 测试更新 site 设置...");
      const { data: updateData, error: updateError } = await supabase
        .from('settings')
        .upsert({
          key: 'site',
          value: {
            siteName: '东南亚法律平台',
            siteDescription: '专业法律咨询平台',
            contactEmail: 'support@legalmy.com',
            contactPhone: '+60 3-1234 5678',
            defaultLanguage: 'zh'
          }
        }, { onConflict: 'key' });

      if (updateError) {
        addResult(`❌ 更新 site 设置失败: ${updateError.message}`);
        addResult(`   错误代码: ${updateError.code}`);
      } else {
        addResult(`✅ 更新 site 设置成功！`);
        
        // 验证更新
        const { data: verifyData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'site')
          .single();
        
        addResult(`   验证: 网站名称现在是 "${verifyData?.value?.siteName}"`);
      }

      addResult("\n=== 诊断完成 ===");

    } catch (error: any) {
      addResult(`\n❌ 发生错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">
          🔍 系统诊断工具
        </h1>
        <p className="text-neutral-600 mb-6">
          此工具将检查数据库连接、用户权限和设置保存功能
        </p>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "诊断中..." : "开始诊断"}
        </button>

        {results.length > 0 && (
          <div className="mt-6 bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-[600px]">
            {results.map((result, index) => (
              <div key={index} className="whitespace-pre-wrap">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-bold text-blue-900 mb-2">📋 使用说明</h2>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>1. 点击"开始诊断"按钮</li>
          <li>2. 查看诊断结果，找出问题所在</li>
          <li>3. 如果测试更新成功，刷新页面查看网站名称是否更新</li>
          <li>4. 将诊断结果截图发送给开发者</li>
        </ul>
      </div>
    </div>
  );
}
