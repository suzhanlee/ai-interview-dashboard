import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import { DashboardData } from '../types/dashboard';
import { fetchDashboardData } from '../data/mockData';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardData();
      setDashboardData(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMetricsByCategory = (category: string) => {
    return dashboardData?.metrics.filter(metric => metric.category === category) || [];
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">⏳</div>
        <p>대시보드 데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__title-section">
          <h1 className="dashboard__title">🤖 AI 면접 시스템 대시보드</h1>
          <p className="dashboard__subtitle">실시간 성능 모니터링 및 분석</p>
        </div>
        
        <div className="dashboard__controls">
          <div className="dashboard__last-update">
            마지막 업데이트: {formatLastUpdate(lastRefresh)}
          </div>
          <button 
            className="dashboard__refresh-btn" 
            onClick={handleRefresh}
            disabled={loading}
          >
            🔄 새로고침
          </button>
        </div>
      </div>

      <div className="dashboard__content">
        {/* 성능 메트릭 섹션 */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">
            ⚡ 성능 지표
            <span className="dashboard__section-subtitle">응답 속도 및 처리 성능</span>
          </h2>
          <div className="dashboard__metrics-grid">
            {getMetricsByCategory('performance').map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* 정확도 메트릭 섹션 */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">
            🎯 정확도 지표
            <span className="dashboard__section-subtitle">AI 분석 및 예측 정확도</span>
          </h2>
          <div className="dashboard__metrics-grid">
            {getMetricsByCategory('accuracy').map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>

        {/* 보안 메트릭 섹션 */}
        <section className="dashboard__section">
          <h2 className="dashboard__section-title">
            🔒 보안 지표
            <span className="dashboard__section-subtitle">플랫폼 보안성 및 안정성</span>
          </h2>
          <div className="dashboard__metrics-grid">
            {getMetricsByCategory('security').map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 