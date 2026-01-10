import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import ProgressStepper from '@/components/ProgressStepper';
import IdentityStep from '@/components/steps/IdentityStep';
import BankingStep from '@/components/steps/BankingStep';
import RegulatoryStep from '@/components/steps/RegulatoryStep';
import ProductsStep from '@/components/steps/ProductsStep';
import ReviewStep from '@/components/steps/ReviewStep';
import { createEmptyOnboarding, DEMO_DATA, type OnboardingData, type OnboardingMode } from '@/types/onboarding';
import { toast } from 'sonner';

const STORAGE_KEY = 'autoapply_onboarding';

const steps = [
  { key: 'identity', labelKey: 'step.identity' },
  { key: 'banking', labelKey: 'step.banking' },
  { key: 'regulatory', labelKey: 'step.regulatory' },
  { key: 'products', labelKey: 'step.products' },
  { key: 'review', labelKey: 'step.review' },
];

const OnboardingWizard = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = (searchParams.get('mode') as OnboardingMode) || 'in-branch';

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return createEmptyOnboarding(mode);
      }
    }
    return createEmptyOnboarding(mode);
  });

  // Save to localStorage on data change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, currentStep }));
  }, [data, currentStep]);

  const handleScanId = () => {
    setData((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        firstName: DEMO_DATA.firstName!,
        lastName: DEMO_DATA.lastName!,
        dateOfBirth: DEMO_DATA.dateOfBirth!,
        placeOfBirth: DEMO_DATA.placeOfBirth!,
        nationality: DEMO_DATA.nationality!,
        phone: DEMO_DATA.phone!,
        address: DEMO_DATA.address!,
      },
      banking: {
        ...prev.banking,
        accountNumber: DEMO_DATA.accountNumber!,
        branch: DEMO_DATA.branch!,
        activationCode: DEMO_DATA.activationCode!,
      },
      timeline: [
        ...prev.timeline,
        {
          id: crypto.randomUUID(),
          type: 'id-uploaded',
          timestamp: new Date().toISOString(),
          description: 'Pièce d\'identité téléchargée',
          actor: 'System',
        },
        {
          id: crypto.randomUUID(),
          type: 'fields-extracted',
          timestamp: new Date().toISOString(),
          description: 'Champs extraits automatiquement',
          actor: 'OCR Engine',
        },
      ],
    }));
    toast.success(language === 'fr' ? 'Champs pré-remplis avec succès!' : 'Fields auto-filled successfully!');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const updatedData = {
      ...data,
      status: 'submitted' as const,
      timeline: [
        ...data.timeline,
        {
          id: crypto.randomUUID(),
          type: 'signed' as const,
          timestamp: new Date().toISOString(),
          description: 'Documents signés électroniquement',
          actor: data.identity.firstName + ' ' + data.identity.lastName,
        },
        {
          id: crypto.randomUUID(),
          type: 'submitted' as const,
          timestamp: new Date().toISOString(),
          description: 'Dossier soumis pour approbation',
          actor: 'System',
        },
      ],
    };
    
    setData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    
    // Save to applications list
    const applications = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
    const existingIndex = applications.findIndex((app: OnboardingData) => app.id === updatedData.id);
    if (existingIndex >= 0) {
      applications[existingIndex] = updatedData;
    } else {
      applications.push(updatedData);
    }
    localStorage.setItem('autoapply_applications', JSON.stringify(applications));
    
    setIsGenerating(false);
    toast.success(language === 'fr' ? 'Pack de documents généré!' : 'Document pack generated!');
    navigate(`/onboarding/documents/${updatedData.id}`);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <IdentityStep
            data={data.identity}
            onChange={(identity) => setData((prev) => ({ ...prev, identity }))}
            onScanId={handleScanId}
          />
        );
      case 1:
        return (
          <BankingStep
            data={data.banking}
            onChange={(banking) => setData((prev) => ({ ...prev, banking }))}
          />
        );
      case 2:
        return (
          <RegulatoryStep
            data={data.regulatory}
            onChange={(regulatory) => setData((prev) => ({ ...prev, regulatory }))}
          />
        );
      case 3:
        return (
          <ProductsStep
            data={data.products}
            onChange={(products) => setData((prev) => ({ ...prev, products }))}
          />
        );
      case 4:
        return (
          <ReviewStep
            onboardingData={data}
            signatureData={data.signature}
            onSignatureChange={(signature) => setData((prev) => ({ ...prev, signature }))}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Progress Stepper */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border p-4">
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-medium">
                  {mode === 'in-branch' ? t('mode.inBranch.title') : t('mode.remote.title')}
                </p>
              </div>
              <ProgressStepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            <div className="bg-card rounded-xl border p-6 lg:p-8">
              {renderStep()}

              {/* Navigation */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('common.previous')}
                  </Button>
                  <Button onClick={nextStep} className="gap-2">
                    {t('common.next')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingWizard;
