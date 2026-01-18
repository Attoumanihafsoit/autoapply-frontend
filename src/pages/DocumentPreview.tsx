import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, FileText, ArrowLeft, CheckCircle2, ShieldCheck, UserCheck, FileCheck2, Loader2, RefreshCw, Smartphone, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { simulationService, SimulationResult } from '@/services/simulationService';
import type { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'autoapply_onboarding';

const DocumentPreview = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedDocId, setSelectedDocId] = useState<string>('doc_1');
  const [data, setData] = useState<OnboardingData | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
    const app = applications.find((a: OnboardingData) => a.id === id);
    const saved = localStorage.getItem(STORAGE_KEY);
    const loadedData = app || (saved ? JSON.parse(saved) : null);

    if (loadedData) {
      setData(loadedData);
      // Artificial delay for "Verification" effect
      setTimeout(() => {
        simulationService.runChecks(loadedData).then(result => {
          setSimulationResult(result);
          if (result.generatedDocuments.length > 0) {
            setSelectedDocId(result.generatedDocuments[0].id);
          }
          setLoading(false);
        });
      }, 1200);
    } else {
      setLoading(false);
    }
  }, [id]);

  const selectedDocument = simulationResult?.generatedDocuments.find((d) => d.id === selectedDocId);

  const handleDownload = (type: 'zip' | 'pdf') => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Préparation du téléchargement...',
        success: 'Téléchargement démarré',
        error: 'Erreur de téléchargement',
      }
    );
  };

  if (loading || !data || !simulationResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-slow"></div>
            <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
          </div>
          <h2 className="mt-8 text-2xl font-bold tracking-tight">Vérification Finale</h2>
          <p className="text-muted-foreground mt-2 text-center max-w-sm">
            Analyse biométrique et contrôles AML en cours...
          </p>
          <div className="flex flex-col gap-2 mt-8 w-64">
            <div className="flex items-center gap-3 text-sm text-foreground/80 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Validation d'identité
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground/80 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              Vérification Sanctions (AML)
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground/80 animate-slide-in-right" style={{ animationDelay: '1s' }}>
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
              Génération du pack bancaire
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-1 container py-8 max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Dossier Validé
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Félicitations {data.identity.firstName}, votre dossier est conforme.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 shadow-sm" onClick={() => handleDownload('zip')}>
                <FileText className="h-4 w-4" />
                Télécharger tout (ZIP)
              </Button>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up">

          {/* Identity Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background border border-green-200 dark:border-green-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserCheck className="h-24 w-24 text-green-600" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow-inner">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-400">Identité</p>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                  Vérifiée
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-green-800 bg-white/60 dark:bg-green-900/40 backdrop-blur-sm border border-green-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <RefreshCw className="h-3 w-3 mr-1.5 animate-spin-slow opacity-70" />
              Correspondance Faciale: 98%
            </div>
          </div>

          {/* AML Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border border-blue-200 dark:border-blue-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="h-24 w-24 text-blue-600" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Conformité (AML)</p>
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  Approuvée
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-blue-800 bg-white/60 dark:bg-blue-900/40 backdrop-blur-sm border border-blue-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <ShieldCheck className="h-3 w-3 mr-1.5 opacity-70" />
              Risque: Faible (Low)
            </div>
          </div>

          {/* Documents Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background border border-purple-200 dark:border-purple-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FileCheck2 className="h-24 w-24 text-purple-600" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Dossier</p>
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  Complet
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-purple-800 bg-white/60 dark:bg-purple-900/40 backdrop-blur-sm border border-purple-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <FileText className="h-3 w-3 mr-1.5 opacity-70" />
              {simulationResult.generatedDocuments.length} documents générés
            </div>
          </div>
        </div>

        {/* Additional Verification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>

          {/* Phone Verification Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-background border border-emerald-200 dark:border-emerald-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smartphone className="h-24 w-24 text-emerald-600" /> 
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Téléphone</p>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                  Vérifié
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-emerald-800 bg-white/60 dark:bg-emerald-900/40 backdrop-blur-sm border border-emerald-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="h-3 w-3 mr-1.5 opacity-70" />
              Opérateur: Orange SN
            </div>
          </div>

          {/* Email Verification Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-white dark:from-cyan-950/20 dark:to-background border border-cyan-200 dark:border-cyan-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Shield className="h-24 w-24 text-cyan-600" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-inner">
                <div className="font-bold text-lg">@</div>
              </div>
              <div>
                <p className="text-sm font-medium text-cyan-800 dark:text-cyan-400">Email</p>
                <h3 className="text-lg font-bold text-cyan-900 dark:text-cyan-100 flex items-center gap-2">
                  Vérifié
                  <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-cyan-800 bg-white/60 dark:bg-cyan-900/40 backdrop-blur-sm border border-cyan-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="h-3 w-3 mr-1.5 opacity-70" />
              Livrable & Valide
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background border border-indigo-200 dark:border-indigo-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <UserCheck className="h-24 w-24 text-indigo-600" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-800 dark:text-indigo-400">Infos Personnelles</p>
                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                  Validées
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </h3>
              </div>
            </div>
            <div className="mt-4 text-xs font-semibold text-indigo-800 bg-white/60 dark:bg-indigo-900/40 backdrop-blur-sm border border-indigo-200/50 inline-flex items-center px-3 py-1 rounded-full shadow-sm">
              <CheckCircle2 className="h-3 w-3 mr-1.5 opacity-70" />
              Cohérence: 100%
            </div>
          </div>
        </div>

        {/* Trust Banner */}
        <div className="mb-10 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-emerald-900">Confiance</h3>
              <div className="text-2xl font-bold text-emerald-700">100% Fiable</div>
            </div>
          </div>
          <div className="text-emerald-800 text-sm md:text-right font-medium bg-white/50 px-4 py-2 rounded-lg border border-emerald-100">
            Aucun fraud detecté, 0 sanction, email et tél vérifiés.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
              <div className="h-px bg-border flex-1"></div>
              Documents
              <div className="h-px bg-border flex-1"></div>
            </h3>
            <div className="space-y-3">
              {simulationResult.generatedDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                    selectedDocId === doc.id
                      ? "bg-primary text-primary-foreground border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]"
                      : "bg-card hover:bg-muted/50 border-border hover:border-primary/30 hover:shadow-sm"
                  )}
                >
                  <div className="relative z-10 flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 p-2 rounded-lg transition-colors",
                      selectedDocId === doc.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground group-hover:text-primary"
                    )}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm leading-tight transition-colors", selectedDocId === doc.id ? "text-white" : "text-foreground group-hover:text-primary")}>
                        {doc.name}
                      </p>
                      <p className={cn("text-[10px] mt-1.5 uppercase tracking-wide font-medium", selectedDocId === doc.id ? "text-white/80" : "text-muted-foreground")}>
                        {doc.type === 'contract' ? 'Contrat' : 'Formulaire'}
                      </p>
                    </div>
                  </div>
                  {selectedDocId === doc.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            {selectedDocument && (
              <div className="bg-card rounded-2xl border shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden h-[850px] flex flex-col animate-fade-in relative group/preview">
                {/* Header */}
                <div className="h-16 border-b px-6 flex items-center justify-between bg-white dark:bg-card/50 backdrop-blur-xl z-10">
                  <h2 className="font-semibold flex items-center gap-2 text-foreground/80">
                    <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    {selectedDocument.name}
                  </h2>
                  <div className="flex gap-2 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="secondary" onClick={() => window.open(selectedDocument.url, '_blank')} className="shadow-sm">
                      <Download className="h-4 w-4 mr-2" />
                      Ouvrir
                    </Button>
                  </div>
                </div>
                {/* PDF Preview */}
                <div className="flex-1 bg-muted/10 relative">
                  <iframe
                    src={`${selectedDocument.url}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full"
                    title="Document Preview"
                  />
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
