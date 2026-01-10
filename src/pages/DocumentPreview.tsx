import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Send, FileText, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import DocumentCard from '@/components/DocumentCard';
import CompletionScore from '@/components/CompletionScore';
import type { OnboardingData, DocumentInfo } from '@/types/onboarding';
import { toast } from 'sonner';

const STORAGE_KEY = 'autoapply_onboarding';

const generateDocuments = (data: OnboardingData): DocumentInfo[] => {
  const hasIdentity = data.identity.firstName && data.identity.lastName;
  const hasAddress = !!data.identity.address;
  const hasBanking = !!data.banking.branch;
  const hasWave = data.products.waveWallet && data.products.waveDetails?.idNumber;

  return [
    {
      id: 'comptes-particuliers',
      name: 'Individual Accounts Form',
      nameFr: 'COMPTES PARTICULIERS',
      completionScore: hasIdentity && hasAddress && hasBanking ? 98 : 65,
      mappedFields: [
        { source: 'Prénom', target: 'Champ 1', value: data.identity.firstName },
        { source: 'Nom', target: 'Champ 2', value: data.identity.lastName },
        { source: 'Date de naissance', target: 'Champ 3', value: data.identity.dateOfBirth },
        { source: 'Adresse', target: 'Champ 4', value: data.identity.address },
        { source: 'Agence', target: 'Champ 5', value: data.banking.branch },
      ],
      missingFields: hasIdentity && hasAddress && hasBanking ? [] : ['Agence'],
      status: hasIdentity && hasAddress && hasBanking ? 'complete' : 'partial',
    },
    {
      id: 'fatca',
      name: 'FATCA Form',
      nameFr: 'FORMULAIRE FATCA',
      completionScore: data.regulatory.sourceOfFunds ? 100 : 50,
      mappedFields: [
        { source: 'US Person', target: 'Case 1', value: data.regulatory.isUsPerson ? 'Oui' : 'Non' },
        { source: 'Source des fonds', target: 'Champ 2', value: data.regulatory.sourceOfFunds },
      ],
      missingFields: data.regulatory.sourceOfFunds ? [] : ['Source des fonds'],
      status: data.regulatory.sourceOfFunds ? 'complete' : 'partial',
    },
    {
      id: 'cartes',
      name: 'Card Subscription Contract',
      nameFr: 'CONTRAT DE SOUSCRIPTION CARTES',
      completionScore: data.products.bankCard && hasIdentity ? 95 : data.products.bankCard ? 70 : 0,
      mappedFields: data.products.bankCard ? [
        { source: 'Nom complet', target: 'Champ Titulaire', value: `${data.identity.firstName} ${data.identity.lastName}` },
        { source: 'Numéro de compte', target: 'Champ Compte', value: data.banking.accountNumber },
      ] : [],
      missingFields: data.products.bankCard ? [] : ['Souscription non sélectionnée'],
      status: data.products.bankCard && hasIdentity ? 'complete' : data.products.bankCard ? 'partial' : 'missing',
    },
    {
      id: 'bic',
      name: 'BIC Form - Individual',
      nameFr: 'FORMULAIRE BIC PERSONNE PHYSIQUE',
      completionScore: hasIdentity && data.regulatory.occupation ? 92 : 45,
      mappedFields: [
        { source: 'Identité', target: 'Section 1', value: `${data.identity.firstName} ${data.identity.lastName}` },
        { source: 'Profession', target: 'Section 2', value: data.regulatory.occupation },
        { source: 'Nationalité', target: 'Section 3', value: data.identity.nationality },
      ],
      missingFields: hasIdentity && data.regulatory.occupation ? [] : ['Profession'],
      status: hasIdentity && data.regulatory.occupation ? 'complete' : 'partial',
    },
    {
      id: 'wave',
      name: 'Wave Client Contract (B2W WAVE)',
      nameFr: 'CONTRAT WAVE CLIENT (B2W WAVE)',
      completionScore: hasWave ? 96 : data.products.waveWallet ? 40 : 0,
      mappedFields: data.products.waveWallet ? [
        { source: 'Nom complet', target: 'Champ Nom', value: `${data.identity.firstName} ${data.identity.lastName}` },
        { source: 'Date de naissance', target: 'Champ DOB', value: data.identity.dateOfBirth },
        { source: 'Lieu de naissance', target: 'Champ POB', value: data.identity.placeOfBirth },
        { source: 'Numéro de compte', target: 'Champ Compte', value: data.banking.accountNumber },
        { source: 'Téléphone', target: 'Champ Tel', value: data.identity.phone },
        { source: 'Code d\'activation', target: 'Champ Code', value: data.banking.activationCode },
        { source: 'Type pièce', target: 'Champ ID Type', value: data.products.waveDetails?.idType || '' },
        { source: 'Pays pièce', target: 'Champ ID Pays', value: data.products.waveDetails?.idCountry || '' },
        { source: 'Numéro pièce', target: 'Champ ID Num', value: data.products.waveDetails?.idNumber || '' },
        { source: 'Adresse', target: 'Champ Adresse', value: data.identity.address },
      ] : [],
      missingFields: hasWave ? [] : data.products.waveWallet ? ['Numéro de pièce d\'identité'] : ['Service non sélectionné'],
      status: hasWave ? 'complete' : data.products.waveWallet ? 'partial' : 'missing',
    },
    {
      id: 'eer',
      name: 'EER Public Form',
      nameFr: 'formulaire public EER',
      completionScore: hasIdentity ? 88 : 30,
      mappedFields: [
        { source: 'Identité complète', target: 'Section A', value: `${data.identity.firstName} ${data.identity.lastName}` },
        { source: 'Contact', target: 'Section B', value: data.identity.phone },
      ],
      missingFields: hasIdentity ? ['Signature secondaire'] : ['Identité', 'Contact'],
      status: hasIdentity ? 'partial' : 'missing',
    },
  ];
};

const DocumentPreview = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<string>('comptes-particuliers');
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    // Try to load from applications list first, then fallback to current onboarding
    const applications = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
    const app = applications.find((a: OnboardingData) => a.id === id);
    
    if (app) {
      setData(app);
      setDocuments(generateDocuments(app));
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setDocuments(generateDocuments(parsed));
      }
    }
  }, [id]);

  const selectedDocument = documents.find((d) => d.id === selectedDoc);

  const handleDownload = (type: 'zip' | 'pdf') => {
    toast.success(
      language === 'fr'
        ? `Téléchargement ${type === 'zip' ? 'du pack complet' : 'des PDFs'} (Démo)`
        : `Downloading ${type === 'zip' ? 'complete pack' : 'PDFs'} (Demo)`
    );
  };

  const handleSendToBank = () => {
    toast.success(
      language === 'fr'
        ? 'Dossier envoyé à la banque pour approbation (Démo)'
        : 'Application sent to bank for approval (Demo)'
    );
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('documents.title')}</h1>
            <p className="text-muted-foreground">
              {data.identity.firstName} {data.identity.lastName}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Document List */}
          <aside className="lg:w-80 shrink-0 space-y-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                isSelected={selectedDoc === doc.id}
                onClick={() => setSelectedDoc(doc.id)}
              />
            ))}

            {/* Export Actions */}
            <div className="pt-4 space-y-3">
              <Button className="w-full gap-2" onClick={() => handleDownload('zip')}>
                <Download className="h-4 w-4" />
                {t('documents.export.zip')}
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={() => handleDownload('pdf')}>
                <FileText className="h-4 w-4" />
                {t('documents.export.pdf')}
              </Button>
              <Button variant="secondary" className="w-full gap-2" onClick={handleSendToBank}>
                <Send className="h-4 w-4" />
                {t('documents.export.send')}
              </Button>
            </div>
          </aside>

          {/* Preview Panel */}
          <div className="flex-1">
            {selectedDocument && (
              <div className="bg-card rounded-xl border overflow-hidden">
                {/* Document Header */}
                <div className="p-6 border-b bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">
                        {language === 'fr' ? selectedDocument.nameFr : selectedDocument.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-2">
                        {selectedDocument.status === 'complete' ? (
                          <span className="badge-success">
                            <Check className="h-3 w-3" />
                            {t('documents.status.complete')}
                          </span>
                        ) : (
                          <span className="badge-warning">
                            <AlertCircle className="h-3 w-3" />
                            {t('documents.status.partial')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-32">
                      <CompletionScore score={selectedDocument.completionScore} />
                    </div>
                  </div>
                </div>

                {/* Mapped Fields */}
                <div className="p-6">
                  <h3 className="font-medium mb-4">{t('documents.mappedFields')}</h3>
                  <div className="space-y-2">
                    {selectedDocument.mappedFields.map((field, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{field.source}</span>
                          <span className="text-xs text-muted-foreground">→</span>
                          <span className="text-sm font-medium">{field.target}</span>
                        </div>
                        <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                          {field.value || '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Missing Fields */}
                  {selectedDocument.missingFields.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-4 text-destructive">{t('documents.missingFields')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDocument.missingFields.map((field, i) => (
                          <span key={i} className="badge-error">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mock PDF Preview */}
                <div className="p-6 border-t">
                  <h3 className="font-medium mb-4">{t('documents.preview')}</h3>
                  <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Aperçu PDF (Démo)</p>
                      <p className="text-xs mt-1">
                        {language === 'fr' ? selectedDocument.nameFr : selectedDocument.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentPreview;
