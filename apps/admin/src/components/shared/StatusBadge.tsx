'use client';

interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
}

const defaultColorMap: Record<string, string> = {
  // General status
  '활성': 'emerald',
  '성공': 'emerald',
  '판매중': 'emerald',
  '정상': 'emerald',
  'online': 'emerald',
  '정산완료': 'emerald',
  '비활성': 'red',
  '실패': 'red',
  '판매중단': 'red',
  'offline': 'red',
  '대기중': 'amber',
  '정산대기': 'amber',
  '일시품절': 'amber',
  'pending': 'amber',
  '실행중': 'blue',
  '확인중': 'blue',
  '진행중': 'blue',
  '처리중': 'blue',
  // Roles
  '연구원': 'blue',
  '조직장': 'purple',
  '기업장': 'indigo',
  '조직관리자': 'purple',
  '공급자': 'emerald',
  '시스템관리자': 'orange',
  // API Tiers
  'Free': 'gray',
  'Basic': 'blue',
  'Pro': 'purple',
  'Enterprise': 'orange',
};

const colorStyles: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const merged = { ...defaultColorMap, ...colorMap };
  const colorKey = merged[status] ?? 'gray';
  const style = colorStyles[colorKey] ?? colorStyles.gray;

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block ${style}`}>
      {status}
    </span>
  );
}
