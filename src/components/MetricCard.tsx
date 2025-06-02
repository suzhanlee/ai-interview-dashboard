import React from 'react';
import { Metric } from '../types/dashboard';

interface MetricCardProps {
  metric: Metric;
  onClick?: () => void;
  isFullWidth?: boolean;
  isWide?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, onClick, isFullWidth = false, isWide = false }) => {
  const formatValue = (value: number, unit: string): string => {
    if (unit === '%' || unit === '점') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-gradient-to-br from-emerald-500 to-green-600';
      case 'good':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-500 to-orange-600';
      case 'error':
        return 'bg-gradient-to-br from-red-500 to-pink-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return '🎯';
      case 'good':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📊';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  if (isWide) {
    // 넓은 카드 (보안용)
    return (
      <div 
        className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 border border-gray-100 w-full max-w-2xl mx-auto"
        onClick={onClick}
      >
        {/* 상단 색상 바 */}
        <div className={`h-2 ${getStatusColor(metric.status)}`} />
        
        {/* 메인 콘텐츠 */}
        <div className="p-6 flex items-center space-x-6">
          {/* 아이콘과 제목 */}
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl ${getStatusColor(metric.status)} flex items-center justify-center text-white text-2xl shadow-lg`}>
              {metric.icon}
            </div>
            <div>
              <h3 className="text-gray-800 font-bold text-xl leading-tight mb-2">
                {metric.title}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                보안 지표
              </span>
            </div>
          </div>

          {/* 메트릭 값 */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatValue(metric.value, metric.unit)}
                </span>
                <span className="text-xl text-gray-500 font-medium">
                  {metric.unit}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">보안 점수</p>
            </div>
          </div>

          {/* 진행률과 상태 */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>보안 수준</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full ${getStatusColor(metric.status)} transition-all duration-500`}
                style={{ width: '95%' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getTrendIcon(metric.trend)}</span>
                <span className="text-sm font-medium text-green-600">
                  +{metric.trendValue}%
                </span>
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                우수
              </div>
            </div>
          </div>

          {/* 상태 아이콘 */}
          <div className="text-3xl">
            {getStatusIcon(metric.status)}
          </div>

          {/* 클릭 안내 */}
          <div className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-sm font-medium">측정 시작</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* 호버 효과 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  }

  // 일반 카드 (고정 높이)
  return (
    <div 
      className="relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 border border-gray-100 w-full h-80"
      onClick={onClick}
    >
      {/* 상단 색상 바 */}
      <div className={`h-2 ${getStatusColor(metric.status)}`} />
      
      {/* 메인 콘텐츠 */}
      <div className="p-5 h-full flex flex-col">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-12 h-12 rounded-lg ${getStatusColor(metric.status)} flex items-center justify-center text-white text-lg shadow-md flex-shrink-0`}>
              {metric.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-800 font-bold text-sm leading-tight mb-2 line-clamp-2">
                {metric.title}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {metric.category === 'performance' && '성능'}
                {metric.category === 'accuracy' && '정확도'}
                {metric.category === 'security' && '보안'}
              </span>
            </div>
          </div>
          
          {/* 상태 아이콘 */}
          <div className="text-xl flex-shrink-0">
            {getStatusIcon(metric.status)}
          </div>
        </div>

        {/* 메트릭 값 */}
        <div className="mb-4 text-center">
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-3xl font-bold text-gray-900">
              {formatValue(metric.value, metric.unit)}
            </span>
            <span className="text-lg text-gray-500 font-medium">
              {metric.unit}
            </span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-4 flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>성능 수준</span>
            <span className="font-medium">
              {metric.status === 'excellent' ? '95%' : 
               metric.status === 'good' ? '75%' : 
               metric.status === 'warning' ? '50%' : '25%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${getStatusColor(metric.status)} transition-all duration-500`}
              style={{ 
                width: metric.status === 'excellent' ? '95%' : 
                       metric.status === 'good' ? '75%' : 
                       metric.status === 'warning' ? '50%' : '25%' 
              }}
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">추세</span>
            <span className="text-sm">{getTrendIcon(metric.trend)}</span>
            <span className={`text-xs font-medium ${
              metric.trend === 'up' ? 'text-green-600' :
              metric.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {metric.trendValue > 0 ? `+${metric.trendValue}%` : 
               metric.trendValue < 0 ? `${metric.trendValue}%` : '0%'}
            </span>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            metric.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
            metric.status === 'good' ? 'bg-blue-100 text-blue-700' :
            metric.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {metric.status === 'excellent' ? '우수' :
             metric.status === 'good' ? '양호' :
             metric.status === 'warning' ? '주의' : '위험'}
          </div>
        </div>

        {/* 클릭 안내 */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-xs font-medium">측정 시작</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 호버 효과 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default MetricCard; 