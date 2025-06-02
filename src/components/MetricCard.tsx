import React from 'react';
import { Metric } from '../types/dashboard';

interface MetricCardProps {
  metric: Metric;
  onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, onClick }) => {
  const formatValue = (value: number, unit: string): string => {
    if (unit === '%' || unit === '점') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'from-green-500 to-emerald-600';
      case 'good':
        return 'from-blue-500 to-cyan-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      case 'stable':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div 
      className={`bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 shadow-lg hover:shadow-xl ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-r ${getStatusColor(metric.status)} p-3 rounded-lg text-2xl`}>
            {metric.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight">
              {metric.title}
            </h3>
            <p className="text-white/60 text-sm mt-1">
              {metric.category === 'performance' && '성능 지표'}
              {metric.category === 'accuracy' && '정확도 지표'}
              {metric.category === 'security' && '보안 지표'}
            </p>
          </div>
        </div>
        {onClick && (
          <div className="text-white/40 text-xl hover:text-white/60 transition-colors">
            🔍
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-white">
              {formatValue(metric.value, metric.unit)}
              <span className="text-lg text-white/70 ml-1">{metric.unit}</span>
            </div>
          </div>
          
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor(metric.trend)}`}>
            <span>{getTrendIcon(metric.trend)}</span>
            <span>{metric.trendValue}%</span>
          </div>
        </div>

        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getStatusColor(metric.status)} transition-all duration-500`}
            style={{ 
              width: metric.status === 'excellent' ? '95%' : 
                     metric.status === 'good' ? '75%' : 
                     metric.status === 'warning' ? '50%' : '25%' 
            }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">상태</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium
            ${metric.status === 'excellent' ? 'bg-green-500/20 text-green-400' :
              metric.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
              metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'}`}
          >
            {metric.status === 'excellent' ? '우수' :
             metric.status === 'good' ? '양호' :
             metric.status === 'warning' ? '주의' : '위험'}
          </span>
        </div>
        
        {onClick && (
          <div className="text-center mt-4 pt-3 border-t border-white/10">
            <span className="text-white/50 text-xs">클릭하여 상세 측정 진행</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard; 