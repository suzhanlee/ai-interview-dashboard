import { MeasurementProcess } from '../types/measurement';

export const measurementProcesses: Record<string, MeasurementProcess> = {
  'report-generation-speed': {
    id: 'report-generation-speed',
    title: '면접 결과표 생성 속도',
    description: '사전 녹화 영상을 이용하여 면접 결과표 생성 속도를 측정합니다.',
    allowFileUpload: true,
    steps: [
      {
        id: 'load-videos',
        message: '사전 녹화 영상 10개 불러오는 중',
        duration: 2000,
        status: 'pending'
      },
      {
        id: 'register-videos',
        message: '사전 녹화 영상 10개 등록 중',
        duration: 1500,
        status: 'pending'
      },
      {
        id: 'request-server',
        message: '결과표 생성 서버에 요청 중',
        duration: 1000,
        status: 'pending'
      },
      {
        id: 'measure-response',
        message: '요청 별 응답 속도 측정 중',
        duration: 2500,
        status: 'pending'
      },
      {
        id: 'calculate-average',
        message: '평균 응답 속도 측정 중',
        duration: 800,
        status: 'pending'
      },
      {
        id: 'validate-result',
        message: '성공 여부 판단 중',
        duration: 500,
        status: 'pending'
      }
    ],
    targetValue: 200,
    targetOperator: 'below',
    unit: 'ms'
  },

  'video-analysis-accuracy': {
    id: 'video-analysis-accuracy',
    title: '영상 분석을 통한 분류 정확도',
    description: '영상 데이터와 기존 패턴을 비교하여 분류 정확도를 측정합니다.',
    allowFileUpload: true,
    steps: [
      {
        id: 'load-data',
        message: '10개의 데이터 불러오는 중',
        duration: 1800,
        status: 'pending'
      },
      {
        id: 'load-patterns',
        message: '기존 패턴 가져오는 중',
        duration: 1200,
        status: 'pending'
      },
      {
        id: 'check-accuracy',
        message: '기존 패턴에 부합하는지 정확도 확인 중',
        duration: 3000,
        status: 'pending'
      },
      {
        id: 'verify-accuracy',
        message: '정확도 검증 중',
        duration: 1500,
        status: 'pending'
      },
      {
        id: 'calculate-average',
        message: '평균 정확도 계산 중',
        duration: 800,
        status: 'pending'
      }
    ],
    targetValue: 95,
    targetOperator: 'above',
    unit: '%'
  },

  'video-scoring-speed': {
    id: 'video-scoring-speed',
    title: '영상 분석을 통한 점수 생성 요청 속도',
    description: '모의 면접 영상을 분석하여 점수 생성 요청 속도를 측정합니다.',
    allowFileUpload: true,
    steps: [
      {
        id: 'load-videos',
        message: '모의 면접 영상 5개 불러오는 중',
        duration: 1500,
        status: 'pending'
      },
      {
        id: 'register-videos',
        message: '모의 면접 영상 5개 등록 중',
        duration: 1200,
        status: 'pending'
      },
      {
        id: 'request-analysis',
        message: '영상 분석 점수 생성 요청 중',
        duration: 1000,
        status: 'pending'
      },
      {
        id: 'measure-scoring',
        message: '영상 분석 점수 측정 중',
        duration: 2000,
        status: 'pending'
      },
      {
        id: 'calculate-average',
        message: '평균 응답 속도 측정 중',
        duration: 800,
        status: 'pending'
      },
      {
        id: 'validate-result',
        message: '성공 여부 판단 중',
        duration: 500,
        status: 'pending'
      }
    ],
    targetValue: 100,
    targetOperator: 'below',
    unit: 'ms'
  },

  'audio-analysis-speed': {
    id: 'audio-analysis-speed',
    title: '음성 분석을 통한 점수 생성 속도',
    description: '질문 및 답변 예문의 음성 분석을 통해 점수 생성 속도를 측정합니다.',
    allowFileUpload: true,
    steps: [
      {
        id: 'load-qa',
        message: '질문 및 답변 예문 5개 불러오는 중',
        duration: 1300,
        status: 'pending'
      },
      {
        id: 'register-qa',
        message: '질문 및 답변 예문 5개 등록 중',
        duration: 1100,
        status: 'pending'
      },
      {
        id: 'load-audio',
        message: '답변 예문 음성 녹음 불러오는 중',
        duration: 1800,
        status: 'pending'
      },
      {
        id: 'request-analysis',
        message: '영상 분석 점수 생성 요청 중',
        duration: 1000,
        status: 'pending'
      },
      {
        id: 'measure-scoring',
        message: '영상 분석 점수 측정 중',
        duration: 2200,
        status: 'pending'
      },
      {
        id: 'calculate-average',
        message: '평균 응답 속도 측정 중',
        duration: 800,
        status: 'pending'
      },
      {
        id: 'validate-result',
        message: '성공 여부 판단 중',
        duration: 500,
        status: 'pending'
      }
    ],
    targetValue: 100,
    targetOperator: 'below',
    unit: 'ms'
  },

  'custom-interview-accuracy': {
    id: 'custom-interview-accuracy',
    title: '정보 입력 후 맞춤형 모의 면접 생성 정확도',
    description: '사용자 정보를 바탕으로 맞춤형 모의 면접 질문 생성의 정확도를 측정합니다.',
    allowFileUpload: true,
    requiresUserInput: true,
    userInputFields: [
      {
        id: 'name',
        label: '이름',
        type: 'text',
        placeholder: '홍길동',
        required: true
      },
      {
        id: 'position',
        label: '지원 직무',
        type: 'select',
        options: ['프론트엔드 개발자', '백엔드 개발자', '풀스택 개발자', '데이터 분석가', 'PM/PO', '디자이너'],
        required: true
      },
      {
        id: 'experience',
        label: '경력',
        type: 'select',
        options: ['신입', '1-2년차', '3-5년차', '5-10년차', '10년 이상'],
        required: true
      },
      {
        id: 'skills',
        label: '주요 기술 스택',
        type: 'textarea',
        placeholder: 'React, TypeScript, Node.js 등',
        required: true
      }
    ],
    steps: [
      {
        id: 'analyze-info',
        message: '사용자 정보 분석 중',
        duration: 1500,
        status: 'pending'
      },
      {
        id: 'generate-questions',
        message: '사용자 정보에 맞는 모의 면접 질문 생성 중',
        duration: 2500,
        status: 'pending'
      },
      {
        id: 'load-evaluation',
        message: '모의 면접 질문 평가 표 불러오는 중',
        duration: 1200,
        status: 'pending'
      },
      {
        id: 'evaluate-questions',
        message: '평가 표에 따라 평가하는 중',
        duration: 2000,
        status: 'pending'
      },
      {
        id: 'calculate-accuracy',
        message: '평균 정확도 계산하는 중',
        duration: 800,
        status: 'pending'
      }
    ],
    targetValue: 95,
    targetOperator: 'above',
    unit: '%'
  },

  'realtime-frame-analysis': {
    id: 'realtime-frame-analysis',
    title: '영상 프레임 실시간 분석 정합도',
    description: '저장된 동영상의 프레임을 추출하여 실시간 분석 정합도를 측정합니다.',
    allowFileUpload: true,
    steps: [
      {
        id: 'load-video',
        message: '저장된 동영상 불러오는 중',
        duration: 1800,
        status: 'pending'
      },
      {
        id: 'extract-frames',
        message: '동영상 프레임 추출 중',
        duration: 3000,
        status: 'pending'
      },
      {
        id: 'create-directory',
        message: '저장 디렉토리 생성 중',
        duration: 500,
        status: 'pending'
      },
      {
        id: 'save-frames',
        message: '프레임 저장 중',
        duration: 2000,
        status: 'pending'
      },
      {
        id: 'verify-frames',
        message: '각 프레임 일치 여부 검증 중',
        duration: 2500,
        status: 'pending'
      },
      {
        id: 'calculate-accuracy',
        message: '최종 정합도 계산 중',
        duration: 1000,
        status: 'pending'
      }
    ],
    targetValue: 98,
    targetOperator: 'above',
    unit: '%'
  },

  'platform-security': {
    id: 'platform-security',
    title: '플랫폼 소프트웨어 보안성 테스트',
    description: 'KISA 보안 점검 가이드를 바탕으로 플랫폼의 보안성을 종합 평가합니다.',
    allowFileUpload: false,
    steps: [
      {
        id: 'load-kisa-guide',
        message: 'KISA 보안 점검 가이드 불러오는 중',
        duration: 1500,
        status: 'pending'
      },
      {
        id: 'secure-coding',
        message: '시큐어 코딩 관점으로 평가 중',
        duration: 2500,
        status: 'pending'
      },
      {
        id: 'code-obfuscation',
        message: '소스코드 난독화 관점으로 평가 중',
        duration: 2200,
        status: 'pending'
      },
      {
        id: 'encryption-test',
        message: '암호화된 키 복호화 여부로 평가 중',
        duration: 1800,
        status: 'pending'
      },
      {
        id: 'stability-test',
        message: '플랫폼 안정성 평가중',
        duration: 2000,
        status: 'pending'
      },
      {
        id: 'calculate-score',
        message: '최종 점수 계산 중',
        duration: 1000,
        status: 'pending'
      }
    ],
    targetValue: 98,
    targetOperator: 'above',
    unit: '점'
  }
}; 