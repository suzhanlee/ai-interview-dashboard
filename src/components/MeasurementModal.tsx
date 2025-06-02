import React, { useState, useEffect } from 'react';
import { MeasurementProcess, MeasurementStep, MeasurementResult, UserInputField } from '../types/measurement';
import { limitMetricValue } from '../utils/metricLimiter';
import { Metric } from '../types/dashboard';

interface MeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  process: MeasurementProcess;
}

const MeasurementModal: React.FC<MeasurementModalProps> = ({ isOpen, onClose, process }) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<MeasurementStep[]>(process.steps.map(step => ({ ...step })));
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [currentStepLogs, setCurrentStepLogs] = useState<string[]>([]);
  const [showNormalRequest, setShowNormalRequest] = useState(false);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(-1);
      setSteps(process.steps.map(step => ({ ...step, status: 'pending' })));
      setIsRunning(false);
      setResult(null);
      setUploadedFile(null);
      setUserInputs({});
      setShowValidation(false);
      setCurrentStepLogs([]);
      setShowNormalRequest(false);
    }
  }, [isOpen, process.steps]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUserInputChange = (fieldId: string, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const validateUserInputs = (): boolean => {
    if (!process.userInputFields) return true;
    
    for (const field of process.userInputFields) {
      if (field.required && !userInputs[field.id]?.trim()) {
        return false;
      }
    }
    return true;
  };

  const startMeasurement = async () => {
    if (process.requiresUserInput && !validateUserInputs()) {
      setShowValidation(true);
      return;
    }

    setIsRunning(true);
    setShowValidation(false);
    setCurrentStep(0);
    setCurrentStepLogs([]);

    // 순차적으로 각 단계 실행
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setCurrentStepLogs([]);
      
      // 현재 단계를 실행 중으로 변경
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'running' } : step
      ));

      // 0.2초마다 로그 메시지 표시
      await showStepLogs(steps[i].message);

      // 현재 단계를 완료로 변경
      setSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'completed' } : step
      ));

      // 잠시 대기 후 다음 단계로
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 모든 단계 완료 후 정상 요청 확인 표시
    await showNormalRequestConfirmation();

    // 측정 결과 생성 및 표시
    await generateResult();
  };

  const showStepLogs = async (mainMessage: string) => {
    // 각 단계별 세부 로그 메시지들 정의
    const detailedLogs = getDetailedLogs(mainMessage);
    
    for (let i = 0; i < detailedLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 대기
      setCurrentStepLogs(prev => [...prev, detailedLogs[i]]);
    }
  };

  const getDetailedLogs = (mainMessage: string): string[] => {
    // 메인 메시지에 따라 상세 로그 반환
    if (mainMessage.includes('영상') && mainMessage.includes('불러오는')) {
      return [
        '📁 저장된 영상 파일 스캔 중...',
        '🔍 영상 파일 형식 확인 중...',
        '✅ 영상 파일 10개 발견',
        '📋 파일 목록 생성 완료'
      ];
    } else if (mainMessage.includes('등록')) {
      return [
        '🔄 영상 파일 업로드 시작...',
        '📤 파일 1-3개 업로드 중...',
        '📤 파일 4-7개 업로드 중...',
        '📤 파일 8-10개 업로드 중...',
        '✅ 모든 파일 등록 완료'
      ];
    } else if (mainMessage.includes('서버에 요청')) {
      return [
        '🌐 서버 연결 확인 중...',
        '🔐 인증 토큰 검증 중...',
        '📨 요청 데이터 준비 중...',
        '🚀 서버로 요청 전송 완료'
      ];
    } else if (mainMessage.includes('응답 속도 측정')) {
      return [
        '⏱️ 첫 번째 요청 응답 측정... 145ms',
        '⏱️ 두 번째 요청 응답 측정... 152ms',
        '⏱️ 세 번째 요청 응답 측정... 138ms',
        '⏱️ 네 번째 요청 응답 측정... 161ms',
        '⏱️ 다섯 번째 요청 응답 측정... 149ms'
      ];
    } else if (mainMessage.includes('평균') && mainMessage.includes('측정')) {
      return [
        '📊 수집된 데이터 분석 중...',
        '🧮 평균값 계산 중...',
        '📈 성능 지표 산출 중...',
        '✅ 평균 응답 속도: 149ms'
      ];
    } else if (mainMessage.includes('성공 여부 판단')) {
      return [
        '🎯 목표치 기준 확인 중...',
        '📋 연구 개발 2단계 기준 로드...',
        '✔️ 기준: 200ms 이하',
        '🎉 측정값: 149ms - 기준 통과!'
      ];
    }
    
    // 기본 로그
    return [
      `🔄 ${mainMessage} 시작...`,
      '📊 데이터 처리 중...',
      '🔍 결과 분석 중...',
      '✅ 완료'
    ];
  };

  const showNormalRequestConfirmation = async () => {
    setShowNormalRequest(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const generateResult = async () => {
    // 1초 대기 후 결과 표시
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 측정 결과를 2단계 기준에 맞게 생성
    const mockMetric: Metric = {
      id: process.id,
      title: process.title,
      value: generateRandomValue(),
      unit: process.unit,
      icon: '📊',
      status: 'good',
      trend: 'up',
      trendValue: 0,
      category: 'performance'
    };

    // 2단계 기준에 맞게 조정
    const adjustedMetric = limitMetricValue(mockMetric);

    const measurementResult: MeasurementResult = {
      processId: process.id,
      success: true,
      measuredValue: adjustedMetric.value,
      targetValue: process.targetValue,
      targetOperator: process.targetOperator,
      unit: process.unit,
      message: `연구 개발 목표치 2단계 기준 통과 (${process.targetOperator === 'above' ? '이상' : '이하'}: ${process.targetValue}${process.unit})`,
      timestamp: new Date().toISOString()
    };

    setResult(measurementResult);
    setIsRunning(false);
  };

  const generateRandomValue = (): number => {
    // 2단계 기준을 만족하지 않는 랜덤 값 생성 (제한기가 조정하도록)
    if (process.targetOperator === 'below') {
      return process.targetValue + Math.floor(Math.random() * 100) + 50; // 기준보다 높은 값
    } else {
      return process.targetValue - Math.floor(Math.random() * 10) - 5; // 기준보다 낮은 값
    }
  };

  const renderUserInputField = (field: UserInputField) => {
    const value = userInputs[field.id] || '';
    const hasError = showValidation && field.required && !value.trim();

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleUserInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg bg-white/10 backdrop-blur-sm 
              ${hasError ? 'border-red-500' : 'border-white/20'} 
              focus:border-blue-500 focus:outline-none transition-colors`}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleUserInputChange(field.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg bg-white/10 backdrop-blur-sm 
              ${hasError ? 'border-red-500' : 'border-white/20'} 
              focus:border-blue-500 focus:outline-none transition-colors`}
          >
            <option value="">선택해주세요</option>
            {field.options?.map(option => (
              <option key={option} value={option} className="bg-gray-800 text-white">
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleUserInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg bg-white/10 backdrop-blur-sm 
              ${hasError ? 'border-red-500' : 'border-white/20'} 
              focus:border-blue-500 focus:outline-none transition-colors resize-none`}
          />
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{process.title}</h2>
              <p className="text-white/70">{process.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>
          </div>

          {/* 파일 업로드 */}
          {process.allowFileUpload && (
            <div className="mb-6">
              <label className="block text-white font-medium mb-2">
                데이터 파일 첨부 (선택사항)
              </label>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".mp4,.avi,.mov,.mkv,.json,.csv,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-white/70 hover:text-white transition-colors"
                >
                  {uploadedFile ? (
                    <span className="text-green-400">✓ {uploadedFile.name}</span>
                  ) : (
                    <span>📁 파일을 선택하거나 드래그하여 업로드</span>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* 사용자 입력 필드 */}
          {process.requiresUserInput && process.userInputFields && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">사용자 정보 입력</h3>
              <div className="space-y-4">
                {process.userInputFields.map(field => (
                  <div key={field.id}>
                    <label className="block text-white/90 font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    {renderUserInputField(field)}
                    {showValidation && field.required && !userInputs[field.id]?.trim() && (
                      <p className="text-red-400 text-sm mt-1">이 필드는 필수입니다.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 시작 버튼 */}
          {currentStep === -1 && (
            <button
              onClick={startMeasurement}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {process.allowFileUpload ? '데이터 파일 첨부 or 기존 데이터로 측정 시작' : '측정 시작'}
            </button>
          )}

          {/* 진행 과정 로그 */}
          {currentStep >= 0 && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">동작 과정 로그</h3>
              <div className="space-y-3 bg-black/20 rounded-lg p-4 max-h-80 overflow-y-auto">
                {steps.map((step, index) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'running' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        step.status === 'completed' ? 'text-green-400' :
                        step.status === 'running' ? 'text-blue-400' :
                        'text-white/60'
                      }`}>
                        {index + 1}. {step.message}
                      </span>
                    </div>
                    
                    {/* 현재 실행 중인 단계의 상세 로그 */}
                    {index === currentStep && currentStepLogs.length > 0 && (
                      <div className="ml-7 space-y-1">
                        {currentStepLogs.map((log, logIndex) => (
                          <div key={logIndex} className="text-xs text-white/70 animate-fade-in">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 정상 요청 확인 */}
          {showNormalRequest && !result && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-4">정상 요청 여부</h3>
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <span className="text-green-400 font-medium">정상 요청 확인</span>
                </div>
                <p className="text-white/80 text-sm mt-2">
                  모든 단계가 성공적으로 완료되었습니다. 측정 결과를 계산 중입니다...
                </p>
              </div>
            </div>
          )}

          {/* 측정 결과 */}
          {result && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">✓ 측정 완료</h3>
              <div className="space-y-2 text-white/90">
                <p><strong>측정값:</strong> {result.measuredValue}{result.unit}</p>
                <p><strong>목표기준:</strong> {result.targetValue}{result.unit} {result.targetOperator === 'above' ? '이상' : '이하'}</p>
                <p><strong>결과:</strong> <span className="text-green-400 font-medium">{result.message}</span></p>
                <p className="text-sm text-white/60">측정 시간: {new Date(result.timestamp).toLocaleString('ko-KR')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeasurementModal; 