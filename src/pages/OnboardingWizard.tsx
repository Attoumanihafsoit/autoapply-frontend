import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import Header from '@/components/Header';
import ProgressStepper from '@/components/ProgressStepper';
import { Step1Civil } from '@/components/steps/Step1Civil';
import { Step2IdentityDoc } from '@/components/steps/Step2IdentityDoc';
import { Step3Profession } from '@/components/steps/Step3Profession';
import { Step4Services } from '@/components/steps/Step4Services';
import { Step5Banking } from '@/components/steps/Step5Banking';
import { Step6Biometric } from '@/components/steps/Step6Biometric';
import { Step7Review } from '@/components/steps/Step7Review';
import { onboardingSchema, type OnboardingFormValues } from '@/lib/validations/onboarding';
import { toast } from 'sonner';

const STORAGE_KEY = 'autoapply_onboarding_new';

const stepsMeta = [
  { key: 'step1', labelKey: 'Civil & Contact', schemaFields: ['step1'] as const },
  { key: 'step2', labelKey: 'Pièce d\'identité', schemaFields: ['step2'] as const },
  { key: 'step3', labelKey: 'Profession', schemaFields: ['step3'] as const },
  { key: 'step4', labelKey: 'Services', schemaFields: ['step4'] as const },
  { key: 'step5', labelKey: 'Banque', schemaFields: ['step5'] as const },
  { key: 'step6', labelKey: 'Biométrie', schemaFields: ['step6'] as const },
  { key: 'step7', labelKey: 'Récapitulatif', schemaFields: [] as const },
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse cached data safely
  const cachedData = localStorage.getItem(STORAGE_KEY);
  const defaultValues: Partial<OnboardingFormValues> = cachedData ? JSON.parse(cachedData) : {};

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      step1: defaultValues.step1 || {},
      step2: defaultValues.step2 || {},
      step3: defaultValues.step3 || {},
      step4: defaultValues.step4 || {},
      step5: defaultValues.step5 || {},
      step6: defaultValues.step6 || { livenessPassed: false, faceMatchPassed: false },
    } as Partial<OnboardingFormValues>,
    mode: 'onTouched', // Validate real-time as user touches fields
  });

  const { trigger, getValues, formState: { isValid } } = methods;

  // Auto-save
  useEffect(() => {
    const subscription = methods.watch((value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [methods.watch]);

  const handleNext = async () => {
    const currentFields = stepsMeta[currentStep].schemaFields;
    // Trigger validation for the specific step fields
    const isStepValid = await trigger(currentFields);
    
    if (isStepValid) {
      if (currentStep < stepsMeta.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast.error('Veuillez corriger les erreurs avant de continuer.');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    setIsSubmitting(true);
    // Submit data to backend simulation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Save to local storage for DocumentPreview to pick it up
    const finalData = { ...data, id: crypto.randomUUID() };
    const applications = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
    applications.push(finalData);
    localStorage.setItem('autoapply_applications', JSON.stringify(applications));
    
    console.log("FINAL ONBOARDING DATA", finalData);
    toast.success('Dossier soumis avec succès !');
    
    localStorage.removeItem(STORAGE_KEY);
    setIsSubmitting(false);
    navigate(`/onboarding/documents/${finalData.id}`);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1Civil />;
      case 1: return <Step2IdentityDoc />;
      case 2: return <Step3Profession />;
      case 3: return <Step4Services />;
      case 4: return <Step5Banking />;
      case 5: return <Step6Biometric />;
      case 6: return <Step7Review />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      <Header />

      <main className="container py-8 max-w-6xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar - Progress Stepper */}
            <aside className="lg:w-72 shrink-0">
              <div className="sticky top-24 bg-card rounded-2xl border p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">Votre dossier</h3>
                  <p className="text-xs text-muted-foreground mt-1">Veuillez compléter toutes les étapes.</p>
                </div>
                <ProgressStepper
                  steps={stepsMeta}
                  currentStep={currentStep}
                  // We can disable clicking future steps directly to enforce sequential validation
                  onStepClick={(index) => {
                    if (index < currentStep) setCurrentStep(index);
                  }}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              <div className="bg-card rounded-2xl border p-6 lg:p-10 shadow-sm min-h-[600px] flex flex-col">
                
                {/* Step Content */}
                <div className="flex-1">
                  {renderStep()}
                </div>

                {/* Navigation Footer */}
                <div className="flex justify-between mt-12 pt-6 border-t items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0 || isSubmitting}
                    className="gap-2 rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  {currentStep < stepsMeta.length - 1 ? (
                    <Button 
                      type="button" 
                      onClick={handleNext} 
                      className="gap-2 rounded-full px-8 shadow-md hover:shadow-lg transition-all"
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="gap-2 rounded-full px-8 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? 'Envoi...' : 'Soumettre le dossier'}
                      {!isSubmitting && <Check className="h-4 w-4" />}
                    </Button>
                  )}
                </div>

              </div>
            </div>
            
          </form>
        </FormProvider>
      </main>
    </div>
  );
};

export default OnboardingWizard;
