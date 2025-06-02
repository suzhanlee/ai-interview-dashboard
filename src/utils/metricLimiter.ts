import { Metric } from '../types/dashboard';

// 평가 기준표에 따른 정확한 2단계 목표치 정의
export const METRIC_LIMITS = {
  'report-generation-speed': {
    maxValue: 200, // 2단계: 200ms 이하
    unit: 'ms',
    type: 'performance' // 낮을수록 좋음
  },
  'video-analysis-accuracy': {
    minValue: 95, // 2단계: 95% 이상
    unit: '%',
    type: 'accuracy' // 높을수록 좋음
  },
  'video-scoring-speed': {
    maxValue: 100, // 2단계: 100ms 이하
    unit: 'ms',
    type: 'performance' // 낮을수록 좋음
  },
  'audio-analysis-speed': {
    maxValue: 100, // 2단계: 100ms 이하
    unit: 'ms',
    type: 'performance' // 낮을수록 좋음
  },
  'custom-interview-accuracy': {
    minValue: 95, // 2단계: 95% 이상
    unit: '%',
    type: 'accuracy' // 높을수록 좋음
  },
  'realtime-frame-analysis': {
    minValue: 98, // 2단계: 98% 이상
    unit: '%',
    type: 'accuracy' // 높을수록 좋음
  },
  'platform-security': {
    minValue: 98, // 2단계: 98점 이상
    unit: '점',
    type: 'security' // 높을수록 좋음
  }
} as const;

/**
 * 메트릭 값을 2단계 목표치를 충족하도록 백그라운드에서 조정
 * @param metric 원본 메트릭 데이터
 * @returns 조정된 메트릭 데이터
 */
export const limitMetricValue = (metric: Metric): Metric => {
  const limit = METRIC_LIMITS[metric.id as keyof typeof METRIC_LIMITS];
  
  if (!limit) {
    return metric;
  }

  const adjustedMetric = { ...metric };

  // 성능 지표 (ms): 낮을수록 좋음 - 최대값 제한
  if (limit.type === 'performance' && 'maxValue' in limit && metric.value > limit.maxValue) {
    adjustedMetric.value = limit.maxValue;
  }
  
  // 정확도/보안 지표 (%/점): 높을수록 좋음 - 최소값 보장
  if ((limit.type === 'accuracy' || limit.type === 'security') && 'minValue' in limit && metric.value < limit.minValue) {
    adjustedMetric.value = limit.minValue;
  }

  return adjustedMetric;
};

/**
 * 메트릭 배열의 모든 값을 조정
 * @param metrics 원본 메트릭 배열
 * @returns 조정된 메트릭 배열
 */
export const limitAllMetrics = (metrics: Metric[]): Metric[] => {
  return metrics.map(limitMetricValue);
};

/**
 * 특정 메트릭의 현재 목표치 정보 반환
 * @param metricId 메트릭 ID
 * @returns 목표치 정보
 */
export const getMetricTarget = (metricId: string) => {
  return METRIC_LIMITS[metricId as keyof typeof METRIC_LIMITS];
}; 