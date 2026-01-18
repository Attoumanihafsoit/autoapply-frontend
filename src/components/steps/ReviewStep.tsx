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
      title: "Identité (EER)",
      fields: [
        { label: "Nom & Prénom", value: `${onboardingData.identity.firstName} ${onboardingData.identity.lastName}` },
        { label: "Date Naissance", value: onboardingData.identity.dateOfBirth },
        { label: "Lieu Naissance", value: onboardingData.identity.placeOfBirth },
        { label: "Nationalité", value: onboardingData.identity.nationality },
        { label: "Profession", value: onboardingData.identity.occupation },
        { label: "Adresse", value: onboardingData.identity.address },
        { label: "Téléphone", value: onboardingData.identity.phone },
        { label: "Email", value: onboardingData.identity.email },
        { label: "Père", value: onboardingData.identity.fatherFirstName },
        { label: "Mère", value: `${onboardingData.identity.motherFirstName} ${onboardingData.identity.motherLastName}` },
      ],
    },
    {
      title: "Compte (BIMAO)",
      fields: [
        { label: "Type", value: onboardingData.banking.accountInfoType === 'corporate' ? 'Société' : 'Particulier' },
        { label: "Agence", value: onboardingData.banking.agency },
        { label: "Dépôt Initial", value: onboardingData.banking.initialDeposit + ' FCFA' },
        ...(onboardingData.banking.accountInfoType === 'individual' ? [
          { label: "Profession", value: onboardingData.banking.profession },
          { label: "Fonction", value: onboardingData.banking.position },
          { label: "Employeur", value: onboardingData.banking.employer },
          { label: "Adresse Postale", value: onboardingData.banking.postalAddress },
        ] : [
          { label: "Société", value: onboardingData.banking.companyName },
          { label: "Forme Juridique", value: onboardingData.banking.legalForm },
          { label: "Siège Social", value: onboardingData.banking.headquarters },
          { label: "N° Compte Principal", value: onboardingData.banking.isMainAccount ? 'Oui' : onboardingData.banking.mainAccountNumber },
          { label: "Introduit par", value: onboardingData.banking.introducedBy },
        ]),
      ],
    },
    {
      title: "Conformité & Banque",
      fields: [
        { label: "US Person", value: onboardingData.compliance.isUsPerson ? "Oui" : "Non" },
        { label: "Résidence Fiscale", value: onboardingData.compliance.isExclusiveTaxResidentSenegal ? "Sénégal (Exclusif)" : `${onboardingData.compliance.taxResidences.length} pays` },
        { label: "N° Compte BIC", value: onboardingData.compliance.bicAccountNumber },
        { label: "Provenance fonds", value: onboardingData.compliance.sourceOfFunds },
        { label: "Volume Mensuel", value: onboardingData.compliance.monthlyVolume },
        { label: "PPE", value: onboardingData.compliance.isPep ? "Oui" : "Non" },
        // Bank Reserve Summary
        { label: "Carnet Chèque", value: onboardingData.banking.checkbookAuthorized ? "Autorisé" : "Non" },
        { label: "Ordre Virement", value: onboardingData.banking.orderBookAuthorized ? "Autorisé" : "Non" },
      ],
    },
  ];


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
                <span className="font-medium text-sm text-right">{field.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Products & Documents Summary */}
      <div className="form-section">
        <h3 className="font-medium mb-4">Produits & Documents sélectionnés</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {onboardingData.products.cardType !== 'none' && <span className="badge-info">Carte {onboardingData.products.cardType.toUpperCase()}</span>}
          {onboardingData.products.hasWave && <span className="badge-info">Wave (B2W)</span>}
          {onboardingData.banking.hasMailbox && <span className="badge-info">Boîte Postale</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${onboardingData.documents.idDocumentFront ? 'bg-green-500' : 'bg-red-500'}`} />
            CNI Recto
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${onboardingData.documents.idDocumentBack ? 'bg-green-500' : 'bg-red-500'}`} />
            CNI Verso
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${onboardingData.documents.selfie ? 'bg-green-500' : 'bg-red-500'}`} />
            Selfie
          </div>
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
          <Label htmlFor="readApproved" className="cursor-pointer text-sm">
            {t('review.readApproved')} (CGU, Convention de Compte, Contrat Carte, Formulaire BIC/FATCA/EER)
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
