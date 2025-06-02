import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardData } from '../types/dashboard';
import { fetchDashboardData } from '../data/mockData';
import MetricCard from './MetricCard';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    navigate(`/measurement/${metricId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p className="text-gray-600 text-lg">AI 면접 대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">데이터를 불러올 수 없습니다.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI 면접 성능 대시보드</h1>
                <p className="text-gray-600">실시간 성능 모니터링 및 분석</p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>새로고침</span>
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 개요 섹션 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">성능 지표 개요</h2>
              <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                마지막 업데이트: {new Date(data.lastUpdated).toLocaleString('ko-KR')}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              AI 면접 플랫폼의 핵심 성능 지표를 실시간으로 모니터링합니다. 
              각 지표를 클릭하여 상세한 측정 과정을 확인하고 성능 분석을 수행할 수 있습니다.
            </p>
            
            {/* 빠른 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-700">우수한 지표</h3>
                    <p className="text-3xl font-bold text-emerald-800">
                      {data.metrics.filter(m => m.status === 'excellent').length}
                    </p>
                    <p className="text-emerald-600 text-sm">/ {data.metrics.length} 개 지표</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📈</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-700">성능 추세</h3>
                    <p className="text-3xl font-bold text-blue-800">
                      {data.metrics.filter(m => m.trend === 'up').length}
                    </p>
                    <p className="text-blue-600 text-sm">개 지표가 향상됨</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-700">평균 응답 시간</h3>
                    <p className="text-3xl font-bold text-purple-800">
                      {Math.round(data.metrics.filter(m => m.unit === 'ms').reduce((acc, m) => acc + m.value, 0) / data.metrics.filter(m => m.unit === 'ms').length || 0)}
                    </p>
                    <p className="text-purple-600 text-sm">밀리초 (ms)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메트릭 그리드 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">성능 지표</h2>
          
          {/* 모든 카드들을 하나의 그리드에 배치 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* 일반 메트릭 카드들 (6개) */}
            {data.metrics.filter(metric => metric.id !== 'platform-security').map((metric) => (
              <MetricCard 
                key={metric.id}
                metric={metric} 
                onClick={() => handleMetricClick(metric.id)}
              />
            ))}
            
            {/* 보안 평가 카드 - 전체 너비 차지 */}
            {data.metrics.find(metric => metric.id === 'platform-security') && (
              <div className="sm:col-span-3">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">보안 평가</h3>
                <MetricCard 
                  metric={data.metrics.find(metric => metric.id === 'platform-security')!}
                  onClick={() => handleMetricClick('platform-security')}
                  isWide={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">시스템 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">모니터링 범위</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 면접 결과표 생성 성능</li>
                <li>• 영상/음성 분석 정확도</li>
                <li>• 실시간 프레임 분석</li>
                <li>• 플랫폼 보안성</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">측정 기준</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• 연구 개발 목표치 2단계 기준</li>
                <li>• 실시간 성능 데이터 수집</li>
                <li>• 자동화된 품질 검증</li>
                <li>• 지속적인 성능 개선</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 