import React from 'react';
import { Metric } from '../types/dashboard';
import './MetricCard.css';

interface MetricCardProps {
  metric: Metric;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
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

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      case 'stable':
        return 'trend-stable';
      default:
        return 'trend-stable';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') {
      return value.toLocaleString();
    } else if (unit === '%') {
      return value.toFixed(1);
    } else {
      return value.toString();
    }
  };

  return (
    <div className={`metric-card metric-card--${metric.status}`}>
      <div className="metric-card__header">
        <div className="metric-card__icon">{metric.icon}</div>
        <div className={`metric-card__status metric-card__status--${metric.status}`}>
          {metric.status}
        </div>
      </div>
      
      <div className="metric-card__body">
        <h3 className="metric-card__title">{metric.title}</h3>
        
        <div className="metric-card__value">
          <span className="metric-card__number">
            {formatValue(metric.value, metric.unit)}
          </span>
          <span className="metric-card__unit">{metric.unit}</span>
        </div>
        
        <div className={`metric-card__trend ${getTrendClass(metric.trend)}`}>
          <span className="metric-card__trend-icon">
            {getTrendIcon(metric.trend)}
          </span>
          <span className="metric-card__trend-value">
            {metric.trendValue > 0 ? `${metric.trendValue}%` : '변동없음'}
          </span>
        </div>
      </div>
      
      <div className="metric-card__category">
        <span className={`metric-card__category-badge metric-card__category-badge--${metric.category}`}>
          {metric.category === 'performance' ? '성능' : 
           metric.category === 'accuracy' ? '정확도' : '보안'}
        </span>
      </div>
    </div>
  );
};

export default MetricCard; 