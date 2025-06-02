// 대시보드 메트릭 타입 정의
export interface Metric {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  status: 'excellent' | 'good' | 'warning' | 'poor';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  category: 'performance' | 'accuracy' | 'security';
}

export interface DashboardData {
  metrics: Metric[];
  lastUpdated: string;
}

// 메트릭 상태에 따른 색상 정의
export const statusColors = {
  excellent: '#10B981', // 초록색
  good: '#3B82F6',      // 파란색
  warning: '#F59E0B',   // 주황색
  poor: '#EF4444'       // 빨간색
} as const; 