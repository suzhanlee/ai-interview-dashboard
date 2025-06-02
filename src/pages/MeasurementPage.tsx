import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { measurementProcesses } from '../data/measurementProcesses';
import { MeasurementStep, MeasurementResult, UserInputField } from '../types/measurement';
import { limitMetricValue } from '../utils/metricLimiter';
import { Metric } from '../types/dashboard';

const MeasurementPage: React.FC = () => {
  const { metricId } = useParams<{ metricId: string }>();
  const navigate = useNavigate();
  const process = metricId ? measurementProcesses[metricId] : null;

  const [currentStep, setCurrentStep] = useState(-1);
  const [steps, setSteps] = useState<MeasurementStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);
  const [currentStepLogs, setCurrentStepLogs] = useState<string[]>([]);
  const [showNormalRequest, setShowNormalRequest] = useState(false);

  useEffect(() => {
    if (process) {
      setSteps(process.steps.map(step => ({ ...step, status: 'pending' })));
    }
  }, [process]);

  if (!process) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">측정 프로세스를 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

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
    const detailedLogs = getDetailedLogs(mainMessage);
    
    for (let i = 0; i < detailedLogs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 대기
      setCurrentStepLogs(prev => [...prev, detailedLogs[i]]);
    }
  };

  const getDetailedLogs = (mainMessage: string): string[] => {
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
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    if (process.targetOperator === 'below') {
      return process.targetValue + Math.floor(Math.random() * 100) + 50;
    } else {
      return process.targetValue - Math.floor(Math.random() * 10) - 5;
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
            className={`w-full px-4 py-3 border rounded-lg bg-white 
              ${hasError ? 'border-red-500' : 'border-gray-300'} 
              focus:border-blue-500 focus:outline-none transition-colors`}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleUserInputChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg bg-white 
              ${hasError ? 'border-red-500' : 'border-gray-300'} 
              focus:border-blue-500 focus:outline-none transition-colors`}
          >
            <option value="">선택해주세요</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
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
            className={`w-full px-4 py-3 border rounded-lg bg-white 
              ${hasError ? 'border-red-500' : 'border-gray-300'} 
              focus:border-blue-500 focus:outline-none transition-colors resize-none`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">대시보드로 돌아가기</span>
              </button>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900">성능 측정</h1>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* 측정 헤더 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-2">{process.title}</h2>
            <p className="text-blue-100">{process.description}</p>
          </div>

          <div className="p-8">
            {/* 파일 업로드 */}
            {process.allowFileUpload && (
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-3">
                  데이터 파일 첨부 (선택사항)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".mp4,.avi,.mov,.mkv,.json,.csv,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {uploadedFile ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📁</div>
                        <p className="font-medium">파일을 선택하거나 드래그하여 업로드</p>
                        <p className="text-sm text-gray-500 mt-1">MP4, JSON, CSV, TXT 파일 지원</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* 사용자 입력 필드 */}
            {process.requiresUserInput && process.userInputFields && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보 입력</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {process.userInputFields.map(field => (
                    <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-gray-700 font-medium mb-2">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {renderUserInputField(field)}
                      {showValidation && field.required && !userInputs[field.id]?.trim() && (
                        <p className="text-red-500 text-sm mt-1">이 필드는 필수입니다.</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 시작 버튼 */}
            {currentStep === -1 && (
              <div className="mb-8">
                <button
                  onClick={startMeasurement}
                  disabled={isRunning}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {process.allowFileUpload ? '데이터 파일 첨부 or 기존 데이터로 측정 시작' : '측정 시작'}
                </button>
              </div>
            )}

            {/* 진행 과정 로그 */}
            {currentStep >= 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">동작 과정 로그</h3>
                <div className="bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto border">
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={step.id} className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'running' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`font-medium ${
                            step.status === 'completed' ? 'text-green-700' :
                            step.status === 'running' ? 'text-blue-700' :
                            'text-gray-500'
                          }`}>
                            {step.message}
                          </span>
                          {step.status === 'running' && (
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                        
                        {index === currentStep && currentStepLogs.length > 0 && (
                          <div className="ml-9 space-y-1">
                            {currentStepLogs.map((log, logIndex) => (
                              <div key={logIndex} className="text-sm text-gray-600 animate-fade-in">
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 정상 요청 확인 */}
            {showNormalRequest && !result && (
              <div className="mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-green-800">정상 요청 확인</h3>
                      <p className="text-green-700">모든 단계가 성공적으로 완료되었습니다. 측정 결과를 계산 중입니다...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 측정 결과 */}
            {result && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-800">측정 완료</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">측정값</p>
                    <p className="text-2xl font-bold text-gray-900">{result.measuredValue}{result.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">목표기준</p>
                    <p className="text-lg font-medium text-gray-700">
                      {result.targetValue}{result.unit} {result.targetOperator === 'above' ? '이상' : '이하'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 font-medium">{result.message}</p>
                  <p className="text-sm text-green-600 mt-1">
                    측정 시간: {new Date(result.timestamp).toLocaleString('ko-KR')}
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    대시보드로 돌아가기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MeasurementPage; 