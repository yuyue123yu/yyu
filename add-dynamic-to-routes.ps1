# 批量为所有 API 路由添加 dynamic 配置

$routeFiles = Get-ChildItem -Path "src/app/api" -Filter "route.ts" -Recurse

foreach ($file in $routeFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # 检查是否已经有 dynamic 配置
    if ($content -notmatch "export const dynamic") {
        # 在文件开头添加配置（在第一个 import 之前）
        $newContent = "// Force dynamic rendering`nexport const dynamic = 'force-dynamic';`nexport const runtime = 'nodejs';`n`n" + $content
        
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        
        Write-Host "✅ Added dynamic config to: $($file.FullName)"
    } else {
        Write-Host "⏭️  Skipped (already has dynamic): $($file.FullName)"
    }
}

Write-Host "`n✅ Done! Processed $($routeFiles.Count) files."
