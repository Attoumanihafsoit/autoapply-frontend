import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SignaturePad from '@/components/SignaturePad';
import type { OnboardingData, SignatureData } from '@/types/onboarding';

interface ReviewStepProps {
  onboardingData: OnboardingData;
  signatureData: SignatureData;
  onSignatureChange: (data: SignatureData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ReviewStep = ({
  onboardingData,
  signatureData,
  onSignatureChange,
  onGenerate,
  isGenerating,
}: ReviewStepProps) => {
  const { t, language } = useLanguage();

  const handleChange = <K extends keyof SignatureData>(field: K, value: SignatureData[K]) => {
    onSignatureChange({ ...signatureData, [field]: value });
  };

  const sections = [
    {
      title: t('step.identity'),
      fields: [
        { label: t('identity.firstName'), value: onboardingData.identity.firstName },
        { label: t('identity.lastName'), value: onboardingData.identity.lastName },
        { label: t('identity.dob'), value: onboardingData.identity.dateOfBirth },
        { label: t('identity.pob'), value: onboardingData.identity.placeOfBirth },
        { label: t('identity.phone'), value: onboardingData.identity.phone },
        { label: t('identity.address'), value: onboardingData.identity.address },
      ],
    },
    {
      title: t('step.banking'),
      fields: [
        { label: t('banking.accountNumber'), value: onboardingData.banking.accountNumber },
        { label: t('banking.branch'), value: onboardingData.banking.branch },
        { label: t('banking.activationCode'), value: onboardingData.banking.activationCode },
      ],
    },
    {
      title: t('step.regulatory'),
      fields: [
        { label: t('regulatory.fatca.usPerson'), value: onboardingData.regulatory.isUsPerson ? t('common.yes') : t('common.no') },
        { label: t('regulatory.sourceOfFunds'), value: onboardingData.regulatory.sourceOfFunds },
        { label: t('regulatory.monthlyVolume'), value: onboardingData.regulatory.expectedMonthlyVolume },
        { label: t('regulatory.occupation'), value: onboardingData.regulatory.occupation },
        { label: t('regulatory.pep'), value: onboardingData.regulatory.isPep ? t('common.yes') : t('common.no') },
      ],
    },
  ];

  const selectedProducts = [];
  if (onboardingData.products.currentAccount) selectedProducts.push(t('products.currentAccount'));
  if (onboardingData.products.bankCard) selectedProducts.push(t('products.bankCard'));
  if (onboardingData.products.waveWallet) selectedProducts.push(t('products.wave'));

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t('review.title')}</h2>

      {/* Summary Sections */}
      {sections.map((section) => (
        <div key={section.title} className="form-section">
          <h3 className="font-medium mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {section.fields.map((field) => (
              <div key={field.label} className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground text-sm">{field.label}</span>
                <span className="font-medium text-sm">{field.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Products */}
      <div className="form-section">
        <h3 className="font-medium mb-4">{t('products.title')}</h3>
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <span key={product} className="badge-info">{product}</span>
          ))}
          {selectedProducts.length === 0 && (
            <span className="text-muted-foreground text-sm">Aucun produit sélectionné</span>
          )}
        </div>
      </div>

      {/* E-Signature Section */}
      <div className="form-section">
        <h3 className="font-medium mb-4">{t('review.signature')}</h3>

        <SignaturePad
          initialSignature={signatureData.signatureDataUrl}
          onSignatureChange={(dataUrl) => handleChange('signatureDataUrl', dataUrl)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="signatureDate">{t('review.signatureDate')}</Label>
            <Input
              id="signatureDate"
              type="date"
              value={signatureData.signatureDate}
              onChange={(e) => handleChange('signatureDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signatureLocation">{t('review.signatureLocation')}</Label>
            <Input
              id="signatureLocation"
              value={signatureData.signatureLocation}
              onChange={(e) => handleChange('signatureLocation', e.target.value)}
              placeholder="Dakar"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 p-4 bg-background rounded-lg border">
          <Checkbox
            id="readApproved"
            checked={signatureData.readAndApproved}
            onCheckedChange={(checked) => handleChange('readAndApproved', checked as boolean)}
          />
          <Label htmlFor="readApproved" className="cursor-pointer">
            {t('review.readApproved')}
          </Label>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={onGenerate}
        disabled={!signatureData.readAndApproved || !signatureData.signatureDataUrl || isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <FileCheck className="h-5 w-5" />
            {t('review.generatePack')}
          </>
        )}
      </Button>
    </div>
  );
};

export default ReviewStep;
