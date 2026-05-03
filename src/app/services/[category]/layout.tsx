// 生成静态路径 - 服务器组件
export function generateStaticParams() {
  return [
    { category: 'debt' },
    { category: 'family' },
    { category: 'business' },
    { category: 'property' },
    { category: 'criminal' },
    { category: 'employment' },
    { category: 'ip' },
  ];
}

export default function ServiceCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
