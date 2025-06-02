export interface MeasurementStep {
  id: string;
  message: string;
  duration: number; // ms
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface MeasurementProcess {
  id: string;
  title: string;
  description: string;
  allowFileUpload: boolean;
  requiresUserInput?: boolean;
  userInputFields?: UserInputField[];
  steps: MeasurementStep[];
  targetValue: number;
  targetOperator: 'above' | 'below';
  unit: string;
}

export interface UserInputField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
  required: boolean;
}

export interface MeasurementResult {
  processId: string;
  success: boolean;
  measuredValue: number;
  targetValue: number;
  targetOperator: 'above' | 'below';
  unit: string;
  message: string;
  timestamp: string;
} 