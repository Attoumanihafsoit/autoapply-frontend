import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  key: string;
  labelKey: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const ProgressStepper = ({ steps, currentStep, onStepClick }: ProgressStepperProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isClickable = onStepClick && index <= currentStep;

        return (
          <div
            key={step.key}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              isClickable ? 'cursor-pointer hover:bg-muted/50' : ''
            } ${isActive ? 'bg-accent/50' : ''}`}
            onClick={() => isClickable && onStepClick(index)}
          >
            <div
              className={
                isComplete
                  ? 'stepper-dot-complete'
                  : isActive
                  ? 'stepper-dot-active'
                  : 'stepper-dot-inactive'
              }
            >
              {isComplete ? <Check className="h-5 w-5" /> : index + 1}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isActive ? 'text-primary' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {t(step.labelKey)}
              </p>
            </div>
            {isComplete && (
              <div className="badge-success">
                <Check className="h-3 w-3" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
