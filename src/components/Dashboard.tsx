import React, { useState, useEffect } from 'react';
import { DashboardData } from '../types/dashboard';
import { fetchDashboardData } from '../data/mockData';
import { measurementProcesses } from '../data/measurementProcesses';
import MetricCard from './MetricCard';
import MeasurementModal from './MeasurementModal';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const dashboardData = await fetchDashboardData();
      setData(dashboardData);
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricClick = (metricId: string) => {
    setSelectedMetricId(metricId);
  };

  const handleCloseModal = () => {
    setSelectedMetricId(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"></div>
          <p className="text-white text-lg">AI 면접 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">데이터를 불러올 수 없습니다.</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const selectedProcess = selectedMetricId ? measurementProcesses[selectedMetricId] : null;

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* 헤더 */}
      <header className="backdrop-blur-lg bg-white/10 border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <span className="text-white text-xl font-bold">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI 면접 성능 대시보드</h1>
                <p className="text-sm text-white/70">실시간 성능 모니터링 및 분석</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                🔄 새로고침
              </button>
              <button
                onClick={toggleTheme}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 개요 섹션 */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">성능 지표 개요</h2>
              <span className="text-white/60 text-sm">
                마지막 업데이트: {new Date(data.lastUpdated).toLocaleString('ko-KR')}
              </span>
            </div>
            <p className="text-white/80 leading-relaxed">
              AI 면접 플랫폼의 핵심 성능 지표를 실시간으로 모니터링합니다. 
              각 지표를 클릭하여 상세한 측정 과정을 확인하고 성능 분석을 수행할 수 있습니다.
            </p>
          </div>
        </div>

        {/* 메트릭 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.metrics.map((metric) => (
            <MetricCard 
              key={metric.id} 
              metric={metric} 
              onClick={() => handleMetricClick(metric.id)}
            />
          ))}
        </div>

        {/* 통계 요약 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">🎯 우수한 지표</h3>
            <p className="text-3xl font-bold text-green-400">
              {data.metrics.filter(m => m.status === 'excellent').length}
            </p>
            <p className="text-white/60 text-sm">/ {data.metrics.length} 개 지표</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">📈 성능 추세</h3>
            <p className="text-3xl font-bold text-blue-400">
              {data.metrics.filter(m => m.trend === 'up').length}
            </p>
            <p className="text-white/60 text-sm">개 지표가 향상됨</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">🔧 평균 응답 시간</h3>
            <p className="text-3xl font-bold text-purple-400">
              {Math.round(data.metrics.filter(m => m.unit === 'ms').reduce((acc, m) => acc + m.value, 0) / data.metrics.filter(m => m.unit === 'ms').length || 0)}
            </p>
            <p className="text-white/60 text-sm">밀리초 (ms)</p>
          </div>
        </div>
      </main>

      {/* 측정 모달 */}
      {selectedProcess && (
        <MeasurementModal
          isOpen={selectedMetricId !== null}
          onClose={handleCloseModal}
          process={selectedProcess}
        />
      )}
    </div>
  );
};

export default Dashboard; 