// 生成静态路径 - 服务器组件
export function generateStaticParams() {
  // 预生成所有律师的静态路径
  return [
    { id: 'law-001' },
    { id: 'law-002' },
    { id: 'law-003' },
    { id: 'law-004' },
    { id: 'law-005' },
    { id: 'law-006' },
    { id: 'law-007' },
    { id: 'law-008' },
    { id: 'law-009' },
    { id: 'law-010' },
  ];
}

export default function LawyerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
