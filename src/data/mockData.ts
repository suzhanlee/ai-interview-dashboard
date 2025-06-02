import { DashboardData } from '../types/dashboard';
import { limitAllMetrics } from '../utils/metricLimiter';

// 2단계 기준을 충족하는 3개의 서로 다른 성능 데이터 세트
const mockDataSets: DashboardData[] = [
  // 데이터 세트 1: 우수한 성능
  {
    metrics: [
      {
        id: 'report-generation-speed',
        title: '면접 결과표 생성 속도',
        value: 145, // 200ms 이하 충족
        unit: 'ms',
        icon: '📊',
        status: 'excellent',
        trend: 'up',
        trendValue: 12.5,
        category: 'performance'
      },
      {
        id: 'video-analysis-accuracy',
        title: '영상 분석을 통한 분류 정확도',
        value: 96.8, // 95% 이상 충족
        unit: '%',
        icon: '🎥',
        status: 'excellent',
        trend: 'up',
        trendValue: 2.8,
        category: 'accuracy'
      },
      {
        id: 'video-scoring-speed',
        title: '영상 분석을 통한 점수 생성 요청 속도',
        value: 78, // 100ms 이하 충족
        unit: 'ms',
        icon: '⚡',
        status: 'excellent',
        trend: 'up',
        trendValue: 8.3,
        category: 'performance'
      },
      {
        id: 'audio-analysis-speed',
        title: '음성 분석을 통한 점수 생성 속도',
        value: 68, // 100ms 이하 충족
        unit: 'ms',
        icon: '🎤',
        status: 'excellent',
        trend: 'up',
        trendValue: 5.2,
        category: 'performance'
      },
      {
        id: 'custom-interview-accuracy',
        title: '정보 입력 후 맞춤형 모의 면접 생성 정확도',
        value: 97.2, // 95% 이상 충족
        unit: '%',
        icon: '🎯',
        status: 'excellent',
        trend: 'up',
        trendValue: 4.2,
        category: 'accuracy'
      },
      {
        id: 'realtime-frame-analysis',
        title: '영상 프레임 실시간 분석 정합도',
        value: 99.1, // 98% 이상 충족
        unit: '%',
        icon: '📹',
        status: 'excellent',
        trend: 'up',
        trendValue: 1.9,
        category: 'accuracy'
      },
      {
        id: 'platform-security',
        title: '플랫폼 소프트웨어 보안성 테스트',
        value: 99, // 98점 이상 충족
        unit: '점',
        icon: '🔒',
        status: 'excellent',
        trend: 'up',
        trendValue: 2.1,
        category: 'security'
      }
    ],
    lastUpdated: new Date().toISOString()
  },

  // 데이터 세트 2: 안정적인 성능
  {
    metrics: [
      {
        id: 'report-generation-speed',
        title: '면접 결과표 생성 속도',
        value: 187, // 200ms 이하 충족
        unit: 'ms',
        icon: '📊',
        status: 'good',
        trend: 'stable',
        trendValue: 1.2,
        category: 'performance'
      },
      {
        id: 'video-analysis-accuracy',
        title: '영상 분석을 통한 분류 정확도',
        value: 95.4, // 95% 이상 충족
        unit: '%',
        icon: '🎥',
        status: 'good',
        trend: 'up',
        trendValue: 1.8,
        category: 'accuracy'
      },
      {
        id: 'video-scoring-speed',
        title: '영상 분석을 통한 점수 생성 요청 속도',
        value: 92, // 100ms 이하 충족
        unit: 'ms',
        icon: '⚡',
        status: 'good',
        trend: 'stable',
        trendValue: 0.5,
        category: 'performance'
      },
      {
        id: 'audio-analysis-speed',
        title: '음성 분석을 통한 점수 생성 속도',
        value: 89, // 100ms 이하 충족
        unit: 'ms',
        icon: '🎤',
        status: 'good',
        trend: 'down',
        trendValue: 2.1,
        category: 'performance'
      },
      {
        id: 'custom-interview-accuracy',
        title: '정보 입력 후 맞춤형 모의 면접 생성 정확도',
        value: 95.8, // 95% 이상 충족
        unit: '%',
        icon: '🎯',
        status: 'good',
        trend: 'stable',
        trendValue: 0.3,
        category: 'accuracy'
      },
      {
        id: 'realtime-frame-analysis',
        title: '영상 프레임 실시간 분석 정합도',
        value: 98.3, // 98% 이상 충족
        unit: '%',
        icon: '📹',
        status: 'good',
        trend: 'up',
        trendValue: 1.2,
        category: 'accuracy'
      },
      {
        id: 'platform-security',
        title: '플랫폼 소프트웨어 보안성 테스트',
        value: 98, // 98점 이상 충족
        unit: '점',
        icon: '🔒',
        status: 'good',
        trend: 'stable',
        trendValue: 0,
        category: 'security'
      }
    ],
    lastUpdated: new Date().toISOString()
  },

  // 데이터 세트 3: 최적화된 성능
  {
    metrics: [
      {
        id: 'report-generation-speed',
        title: '면접 결과표 생성 속도',
        value: 162, // 200ms 이하 충족
        unit: 'ms',
        icon: '📊',
        status: 'excellent',
        trend: 'up',
        trendValue: 7.8,
        category: 'performance'
      },
      {
        id: 'video-analysis-accuracy',
        title: '영상 분석을 통한 분류 정확도',
        value: 97.5, // 95% 이상 충족
        unit: '%',
        icon: '🎥',
        status: 'excellent',
        trend: 'up',
        trendValue: 3.2,
        category: 'accuracy'
      },
      {
        id: 'video-scoring-speed',
        title: '영상 분석을 통한 점수 생성 요청 속도',
        value: 85, // 100ms 이하 충족
        unit: 'ms',
        icon: '⚡',
        status: 'excellent',
        trend: 'up',
        trendValue: 6.7,
        category: 'performance'
      },
      {
        id: 'audio-analysis-speed',
        title: '음성 분석을 통한 점수 생성 속도',
        value: 74, // 100ms 이하 충족
        unit: 'ms',
        icon: '🎤',
        status: 'excellent',
        trend: 'up',
        trendValue: 9.1,
        category: 'performance'
      },
      {
        id: 'custom-interview-accuracy',
        title: '정보 입력 후 맞춤형 모의 면접 생성 정확도',
        value: 96.4, // 95% 이상 충족
        unit: '%',
        icon: '🎯',
        status: 'excellent',
        trend: 'up',
        trendValue: 2.8,
        category: 'accuracy'
      },
      {
        id: 'realtime-frame-analysis',
        title: '영상 프레임 실시간 분석 정합도',
        value: 98.7, // 98% 이상 충족
        unit: '%',
        icon: '📹',
        status: 'excellent',
        trend: 'up',
        trendValue: 1.5,
        category: 'accuracy'
      },
      {
        id: 'platform-security',
        title: '플랫폼 소프트웨어 보안성 테스트',
        value: 98, // 98점 이상 충족
        unit: '점',
        icon: '🔒',
        status: 'good',
        trend: 'up',
        trendValue: 1.8,
        category: 'security'
      }
    ],
    lastUpdated: new Date().toISOString()
  }
];

// 랜덤하게 데이터 세트 선택하는 함수
const getRandomMockData = (): DashboardData => {
  const randomIndex = Math.floor(Math.random() * mockDataSets.length);
  const selectedSet = mockDataSets[randomIndex];
  
  // 시간 업데이트
  return {
    ...selectedSet,
    lastUpdated: new Date().toISOString()
  };
};

// 기본 내보내기용 데이터 (첫 번째 세트)
export const mockDashboardData: DashboardData = {
  ...mockDataSets[0],
  metrics: limitAllMetrics(mockDataSets[0].metrics)
};

// API 호출을 시뮬레이션하는 함수 (매번 랜덤 데이터 반환)
export const fetchDashboardData = async (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 랜덤하게 데이터 세트 선택
      const randomData = getRandomMockData();
      
      // 백그라운드에서 안전장치 적용
      const safeData = {
        ...randomData,
        metrics: limitAllMetrics(randomData.metrics),
        lastUpdated: new Date().toISOString()
      };
      
      resolve(safeData);
    }, 500);
  });
};

// 실제 API 호출 함수 (나중에 실제 백엔드와 연동 시 사용)
export const fetchDashboardDataFromAPI = async (apiUrl: string): Promise<DashboardData> => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const rawData: DashboardData = await response.json();
    
    // 백그라운드에서 안전장치 적용
    const safeData: DashboardData = {
      ...rawData,
      metrics: limitAllMetrics(rawData.metrics),
      lastUpdated: new Date().toISOString()
    };
    
    return safeData;
    
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    throw error;
  }
}; 