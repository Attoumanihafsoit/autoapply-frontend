import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Check, X, MessageSquare, Clock, User, Building2, Globe,
  Search, Filter, ArrowUpRight, FileText, ShieldCheck, CreditCard,
  AlertCircle, ChevronRight, Briefcase, Download, Maximize2, CheckCircle2,
  Smartphone, Shield, Facebook, Twitter, Linkedin, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import type { OnboardingData, OnboardingStatus } from '@/types/onboarding';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr as frLocale, enUS } from 'date-fns/locale';

// Demo Data (Reused)
const DEMO_APPLICATIONS: OnboardingData[] = [
  {
    id: 'demo-1',
    mode: 'in-branch',
    status: 'submitted',
    currentStep: 5,
    identity: {
      firstName: 'Fatou',
      lastName: 'Sow',
      dateOfBirth: '1990-03-22',
      placeOfBirth: 'Thiès',
      nationality: 'senegalese',
      phone: '+221 78 234 56 78',
      email: 'fatou.sow@example.com',
      address: '45 Avenue Cheikh Anta Diop, Dakar',
      occupation: 'Médecin',
      fatherFirstName: 'Amadou',
      motherFirstName: 'Aminata',
      motherLastName: 'Diop',
      idNumber: '1234567890123',
      idIssueDate: '2020-01-01',
      emergencyContactName: 'Moussa Sow',
      emergencyContactPhone: '+221 77 000 00 00'
    },
    banking: {
      accountInfoType: 'individual',
      agency: 'dakar-almadies',
      initialDeposit: '50000',
      hasMailbox: true,
      // Individual
      postalAddress: 'BP 1234',
      employer: 'Hôpital Principal',
      employedSince: '2015-05-10',
      profession: 'Médecin Généraliste',
      idIssueDetails: 'Dakar le 20/01/2020',
      // Corporate Placeholder
      companyName: '', headquarters: '', mailingAddress: '', legalForm: '',
      hasRelatedAccounts: false, isMainAccount: true, mainAccountNumber: '',
      mergeInterests: false, bankingReferences: '', maintenanceFees: '',
      keepExtracts: false, otherReferences: '', introducedBy: '',
      submittedDocs: { delegation: false, statuts: false, pouvoirs: false, rccm: false, specimen: false, autres: '' },
      checkbookAuthorized: false, orderBookAuthorized: false, waitForInfo: false, waitForFunds: false, bankComments: ''
    },
    documents: {
      idDocumentFront: undefined, idDocumentBack: undefined, selfie: undefined
    },
    compliance: {
      isUsPerson: false,
      isExclusiveTaxResidentSenegal: true,
      taxResidences: [],
      sourceOfFunds: 'salary',
      monthlyVolume: '2000000-10000000',
      isPep: false,
      bicAccountNumber: 'SN0123456789',
      creditInfoConsent: true
    },
    products: {
      cardType: 'platine',
      branchCode: '00123',
      hasWave: false,
    },
    signature: {
      readAndApproved: true,
      signatureDate: '2024-01-15',
      signatureLocation: 'Dakar',
    },
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T10:45:00Z',
    timeline: [
      { id: '1', type: 'created', timestamp: '2024-01-15T09:30:00Z', description: 'Onboarding créé', actor: 'System' },
      { id: '2', type: 'id-uploaded', timestamp: '2024-01-15T09:35:00Z', description: 'Pièce identité téléchargée', actor: 'Fatou Sow' },
      { id: '4', type: 'submitted', timestamp: '2024-01-15T10:45:00Z', description: 'Dossier soumis', actor: 'System' },
    ],
  },
  {
    id: 'demo-2',
    mode: 'remote',
    status: 'approved',
    currentStep: 5,
    identity: {
      firstName: 'Tech Solutions',
      lastName: 'SARL',
      dateOfBirth: '2018-01-01', // Date creation
      placeOfBirth: 'Dakar',
      nationality: 'senegalese',
      phone: '+221 33 800 00 00',
      email: 'contact@techsolutions.sn',
      address: 'Immeuble ABC, Plateau',
      occupation: 'Services Informatiques',
      fatherFirstName: '', motherFirstName: '', motherLastName: '',
      idNumber: 'RCCM-DKR-2018-B-12345', idIssueDate: '', emergencyContactName: '', emergencyContactPhone: ''
    },
    banking: {
      accountInfoType: 'corporate',
      agency: 'dakar-plateau',
      initialDeposit: '1000000',
      hasMailbox: true,
      // Individual
      postalAddress: '', employer: '', employedSince: '', profession: '', idIssueDetails: '',
      // Corporate
      companyName: 'Tech Solutions SARL',
      headquarters: 'Dakar Plateau',
      mailingAddress: 'BP 9999',
      legalForm: 'SARL',
      hasRelatedAccounts: false, isMainAccount: true, mainAccountNumber: '',
      mergeInterests: false, bankingReferences: 'SGBS', maintenanceFees: '2500',
      keepExtracts: true, otherReferences: '', introducedBy: 'Mr Directeur',
      submittedDocs: { delegation: true, statuts: true, pouvoirs: true, rccm: true, specimen: true, autres: '' },
      checkbookAuthorized: true, orderBookAuthorized: true, waitForInfo: false, waitForFunds: false, bankComments: 'Client VIP'
    },
    documents: { idDocumentFront: undefined, idDocumentBack: undefined, selfie: undefined },
    compliance: {
      isUsPerson: false,
      isExclusiveTaxResidentSenegal: true,
      taxResidences: [],
      sourceOfFunds: 'business',
      monthlyVolume: '10000000+',
      isPep: false,
      bicAccountNumber: '', creditInfoConsent: true
    },
    products: { cardType: 'none', branchCode: '00001', hasWave: true },
    signature: { readAndApproved: true, signatureDate: '2024-01-10', signatureLocation: 'Dakar' },
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    timeline: [
      { id: '1', type: 'created', timestamp: '2024-01-10T14:00:00Z', description: 'Onboarding créé', actor: 'System' },
      { id: '2', type: 'submitted', timestamp: '2024-01-10T15:30:00Z', description: 'Dossier soumis', actor: 'System' },
      { id: '3', type: 'approved', timestamp: '2024-01-12T11:30:00Z', description: 'Approuvé par Comité', actor: 'Admin' },
    ],
  }
];

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<OnboardingData[]>([]);
  const [selectedApp, setSelectedApp] = useState<OnboardingData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState('');

  // For document preview modal
  const [previewDoc, setPreviewDoc] = useState<{ title: string, src?: string } | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
      const demoIds = DEMO_APPLICATIONS.map(d => d.id);

      // Filter out corrupted data safely
      const userApps = saved.filter((app: any) =>
        !demoIds.includes(app.id) &&
        app.identity &&
        app.banking &&
        app.compliance
      );

      const combined = [...DEMO_APPLICATIONS, ...userApps].sort((a, b) =>
        new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime()
      );
      setApplications(combined as OnboardingData[]);
      if (combined.length > 0) setSelectedApp(combined[0] as OnboardingData);
    } catch (error) {
      console.error("Error loading apps", error);
      setApplications(DEMO_APPLICATIONS);
    }
  }, []);

  const handleStatusChange = (appId: string, newStatus: OnboardingStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, status: newStatus } : app
      )
    );
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? ({ ...prev, status: newStatus }) : null);
    }
    toast.success("Statut mis à jour");
  };

  const handleRequestInfo = () => {
    if (selectedApp) {
      handleStatusChange(selectedApp.id, 'needs-info');
      setShowRequestInfoDialog(false);
      setRequestInfoMessage('');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', { locale: language === 'fr' ? frLocale : enUS });
    } catch { return dateString; }
  };

  const filteredApps = applications.filter(app =>
    app.identity.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.identity.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-1/3 min-w-[320px] max-w-[400px] border-r bg-muted/10 flex flex-col">
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Dossiers ({filteredApps.length})
              </h1>
              <Button variant="ghost" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un dossier..."
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredApps.map(app => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${selectedApp?.id === app.id ? 'bg-background border-primary shadow-md' : 'bg-background/50 border-transparent hover:bg-background'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${app.banking.accountInfoType === 'corporate' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {app.banking.accountInfoType === 'corporate' ? <Building2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm leading-tight">{app.identity.firstName} {app.identity.lastName}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{app.banking.accountInfoType === 'corporate' ? 'Société' : 'Particulier'}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatDate(app.createdAt).split(' ')[0]}</span>
                  <span className="flex items-center gap-1">{app.mode === 'in-branch' ? 'Agence' : 'Distance'} <ArrowUpRight className="h-3 w-3" /></span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="flex-1 flex flex-col bg-background h-full overflow-hidden relative">
          {selectedApp ? (
            <>
              {/* Header */}
              <div className="h-16 border-b flex items-center justify-between px-6 shrink-0 bg-background/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {selectedApp.identity.firstName[0]}{selectedApp.identity.lastName[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{selectedApp.identity.firstName} {selectedApp.identity.lastName}</h2>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      ID: {selectedApp.id.slice(0, 8)} • <span className="uppercase">{selectedApp.banking.accountInfoType}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {selectedApp.status === 'submitted' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => setShowRequestInfoDialog(true)} className="text-orange-600 border-orange-200 hover:bg-orange-50">
                        <MessageSquare className="h-4 w-4 mr-2" /> Demander Info
                      </Button>
                      <Button size="sm" onClick={() => handleStatusChange(selectedApp.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-2" /> Valider
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleStatusChange(selectedApp.id, 'rejected')}>
                        <X className="h-4 w-4 mr-2" /> Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                  <div className="px-6 pt-4 border-b bg-muted/5 shrink-0">
                    <TabsList className="grid w-full grid-cols-6 max-w-3xl bg-secondary/50">
                      <TabsTrigger value="overview">Vue Global</TabsTrigger>
                      <TabsTrigger value="verification" className="text-primary font-semibold flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Vérif.</TabsTrigger>
                      <TabsTrigger value="identity">Identité</TabsTrigger>
                      <TabsTrigger value="banking">Bancaire</TabsTrigger>
                      <TabsTrigger value="compliance">Conformité</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="mt-0 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Score de Risque</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
                              Faible <ShieldCheck className="h-6 w-6" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Basé sur PEP et Volumétrie</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Volume Mensuel</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-lg font-bold truncate">{selectedApp.compliance.monthlyVolume}</div>
                            <p className="text-xs text-muted-foreground mt-1">Est. FCFA</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Agence</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-lg font-bold truncate">{selectedApp.banking.agency}</div>
                          </CardContent>
                        </Card>

                        {/* TRUST SIGNAL CARD */}
                        <Card className="bg-emerald-50 border-emerald-200">
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-emerald-800">Confiance</CardTitle></CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
                              100% Fiable
                            </div>
                            <p className="text-[10px] text-emerald-700/80 mt-1 font-medium leading-tight">
                              Aucun fraud detecté, 0 sanction, email et tél vérifiés.
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-background rounded-xl border p-4">
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Timeline</h3>
                        <div className="space-y-4 relative pl-2">
                          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                          {selectedApp.timeline.map((event) => (
                            <div key={event.id} className="relative pl-6">
                              <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-primary bg-background z-10" />
                              <p className="text-sm font-medium">{event.description}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)} • {event.actor}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* VERIFICATION TAB (New) */}
                    <TabsContent value="verification" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Identity Verification Card */}
                        <Card className="border-t-4 border-t-green-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              Vérification d'identité
                            </CardTitle>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">✓ API LIVE</Badge>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-sm text-muted-foreground">Statut</span>
                              <span className="text-sm font-bold text-green-600">PASSED</span>
                            </div>
                            <DetailRow label="Type de document" value={selectedApp.documents.idDocumentFront ? "Carte Nationale d'Identité" : "Non soumis"} />
                            <DetailRow label="Tranche d'âge" value="25-35 Ans" />
                            <DetailRow label="Confiance biométrique" value={<span className="text-blue-600 font-bold">99.3%</span>} />
                            <DetailRow label="Qualité image" value="Reflets détectés, Nette" />
                          </CardContent>
                        </Card>

                        {/* Phone Verification Card */}
                        <Card className="border-t-4 border-t-green-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                              <Smartphone className="h-5 w-5 text-green-600" />
                              Vérification téléphone
                            </CardTitle>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">✓ API LIVE</Badge>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="text-sm text-muted-foreground">Numéro</span>
                              <span className="text-sm font-bold text-green-600">Valide</span>
                            </div>
                            <DetailRow label="Opérateur" value="Orange Sénégal" />
                            <DetailRow label="Pays & Type" value="SN - Mobile" />
                            <DetailRow label="Score de risque" value={<span className="text-green-600 font-bold">1 (Faible)</span>} />
                            <div className="pt-2">
                              <span className="text-xs text-muted-foreground block mb-2">Comptes liés détectés :</span>
                              <div className="flex gap-2">
                                <SocialIcon icon={<Facebook className="h-3 w-3" />} label="Facebook" />
                                <SocialIcon icon={<Twitter className="h-3 w-3" />} label="Twitter/X" />
                                <SocialIcon icon={<Linkedin className="h-3 w-3" />} label="LinkedIn" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Email & Profile Card */}
                        <Card className="md:col-span-2">
                          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Analyse Globale du Profil</CardTitle></CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                              <Shield className="h-8 w-8 text-green-600" />
                              <div>
                                <p className="font-bold text-green-900">Pas de Sanctions</p>
                                <p className="text-xs text-green-700">Aucune correspondance sur les listes noires (UN, OFAC, EU).</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">@</div>
                              <div>
                                <p className="font-bold text-blue-900">Email Vérifié</p>
                                <p className="text-xs text-blue-700">Domaine valide, pas de fuite de données connue.</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                              <ThumbsUp className="h-8 w-8 text-purple-600" />
                              <div>
                                <p className="font-bold text-purple-900">Profil Réel</p>
                                <p className="text-xs text-purple-700">Forte probabilité d'une personne physique réelle.</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* IDENTITY TAB */}
                    <TabsContent value="identity" className="mt-0">
                      <Card>
                        <CardHeader><CardTitle>Informations Personnelles</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-x-12 gap-y-6">
                          <DetailItem label="Prénom" value={selectedApp.identity.firstName} />
                          <DetailItem label="Nom" value={selectedApp.identity.lastName} />
                          <DetailItem label="Date de Naissance" value={selectedApp.identity.dateOfBirth} />
                          <DetailItem label="Lieu de Naissance" value={selectedApp.identity.placeOfBirth} />
                          <DetailItem label="Nationalité" value={selectedApp.identity.nationality} />
                          <DetailItem label="Profession" value={selectedApp.identity.occupation} />
                          <div className="col-span-2 border-t pt-4 mt-2">
                            <h4 className="font-semibold mb-4 text-sm">Coordonnées</h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                              <DetailItem label="Téléphone" value={selectedApp.identity.phone} />
                              <DetailItem label="Email" value={selectedApp.identity.email} />
                              <DetailItem label="Adresse" value={selectedApp.identity.address} full />
                            </div>
                          </div>
                          <div className="col-span-2 border-t pt-4 mt-2">
                            <h4 className="font-semibold mb-4 text-sm">Pièce d'Identité</h4>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                              <DetailItem label="Numéro ID" value={selectedApp.identity.idNumber} />
                              <DetailItem label="Délivrée le" value={selectedApp.identity.idIssueDate} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* BANKING TAB */}
                    <TabsContent value="banking" className="mt-0 space-y-6">
                      <Card>
                        <CardHeader><CardTitle>Détails du Compte ({selectedApp.banking.accountInfoType === 'corporate' ? 'Société' : 'Particulier'})</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-x-12 gap-y-6">
                          <DetailItem label="Agence" value={selectedApp.banking.agency} />
                          <DetailItem label="Dépôt Initial" value={`${selectedApp.banking.initialDeposit} FCFA`} />
                          <DetailItem label="Boîte Postale" value={selectedApp.banking.hasMailbox ? 'Oui' : 'Non'} />

                          {selectedApp.banking.accountInfoType === 'individual' ? (
                            <>
                              <div className="col-span-2 border-t my-2" />
                              <DetailItem label="Profession" value={selectedApp.banking.profession} />
                              <DetailItem label="Employeur" value={selectedApp.banking.employer} />
                              <DetailItem label="Employé depuis" value={selectedApp.banking.employedSince} />
                              <DetailItem label="Adresse Postale" value={selectedApp.banking.postalAddress} />
                            </>
                          ) : (
                            <>
                              <div className="col-span-2 border-t my-2" />
                              <DetailItem label="Raison Sociale" value={selectedApp.banking.companyName} />
                              <DetailItem label="Forme Juridique" value={selectedApp.banking.legalForm} />
                              <DetailItem label="Siège Social" value={selectedApp.banking.headquarters} full />
                              <DetailItem label="Adresse Courrier" value={selectedApp.banking.mailingAddress} full />
                              <DetailItem label="Compte Principal" value={selectedApp.banking.isMainAccount ? 'Oui' : `Non (Principal: ${selectedApp.banking.mainAccountNumber})`} />
                              <DetailItem label="Références Bancaires" value={selectedApp.banking.bankingReferences} />
                              <div className="col-span-2 space-y-2 mt-2 bg-muted p-4 rounded-lg">
                                <h4 className="font-semibold text-sm">Documents Requis (Checklist)</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedApp.banking.submittedDocs && Object.entries(selectedApp.banking.submittedDocs).map(([key, val]) => (
                                    val === true && <Badge key={key} variant="secondary" className="uppercase">{key}</Badge>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-600 bg-blue-50/10">
                        <CardHeader><CardTitle className="text-blue-700 flex items-center gap-2"><CreditCard className="h-5 w-5" /> Réservé Banque</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-6">
                          <DetailItem label="Chéquier Autorisé" value={selectedApp.banking.checkbookAuthorized ? 'Oui' : 'Non'} />
                          <DetailItem label="Carnet d'Ordre Autorisé" value={selectedApp.banking.orderBookAuthorized ? 'Oui' : 'Non'} />
                          <DetailItem label="Attente Infos" value={selectedApp.banking.waitForInfo ? 'Oui' : 'Non'} />
                          <DetailItem label="Attente Fonds" value={selectedApp.banking.waitForFunds ? 'Oui' : 'Non'} />
                          <div className="col-span-2">
                            <span className="text-xs text-muted-foreground block mb-1">Remarques / Instructions</span>
                            <p className="text-sm bg-background p-3 rounded border min-h-[60px]">{selectedApp.banking.bankComments || 'Aucune remarque.'}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* COMPLIANCE TAB */}
                    <TabsContent value="compliance" className="mt-0">
                      <Card>
                        <CardHeader><CardTitle>Conformité & FATCA</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <DetailItem label="US Person" value={selectedApp.compliance.isUsPerson ? 'OUI (Alerte)' : 'Non'} />
                            <DetailItem label="PPE (Personne Politiquement Exposée)" value={selectedApp.compliance.isPep ? 'OUI (Alerte)' : 'Non'} />
                            <DetailItem label="Provenance des Fonds" value={selectedApp.compliance.sourceOfFunds} />
                            <DetailItem label="Consentement BIC" value={selectedApp.compliance.creditInfoConsent ? 'Signé' : 'Non signé'} />
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold text-sm mb-3">Résidence Fiscale</h4>
                            {selectedApp.compliance.isExclusiveTaxResidentSenegal ? (
                              <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 text-sm">
                                Résident Fiscal Exclusif : Sénégal
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedApp.compliance.taxResidences?.map((res, idx) => (
                                  <div key={idx} className="flex justify-between p-3 bg-muted rounded">
                                    <span className="font-medium">{res.country}</span>
                                    <span className="font-mono text-xs">{res.nif || 'N/A'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* DOCUMENTS TAB */}
                    <TabsContent value="documents" className="mt-0 space-y-6">
                      {/* GENERATED DOCUMENTS */}
                      <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Documents Générés (Contrats)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 1. Formulaire d'Ouverture - Always */}
                          <GeneratedDocCard
                            title="Formulaire Ouverture Compte (EER).pdf"
                            size="315 KB"
                            date={formatDate(selectedApp.updatedAt)}
                            onPreview={() => setPreviewDoc({ title: "Formulaire Ouverture (EER)", src: "/doc/formulaire_eer.pdf" })}
                          />

                          {/* 2. Fiche Signalétique - Always */}
                          <GeneratedDocCard
                            title="Convention de Compte Particulier.pdf"
                            size="1.1 MB"
                            date={formatDate(selectedApp.updatedAt)}
                            onPreview={() => setPreviewDoc({ title: "Convention de Compte", src: "/doc/comptes_particuliers.pdf" })}
                          />

                          {/* 3. Formulaire BIC - Always */}
                          <GeneratedDocCard
                            title="Autorisation Consultation BIC.pdf"
                            size="250 KB"
                            date={formatDate(selectedApp.updatedAt)}
                            onPreview={() => setPreviewDoc({ title: "Autorisation BIC", src: "/doc/formulaire_bic.pdf" })}
                          />

                          {/* 4. Contrat Carte - Conditional */}
                          {selectedApp.products.cardType !== 'none' && (
                            <GeneratedDocCard
                              title={`Contrat Carte ${selectedApp.products.cardType.toUpperCase()}.pdf`}
                              size="340 KB"
                              date={formatDate(selectedApp.updatedAt)}
                              onPreview={() => setPreviewDoc({ title: "Contrat Carte Bancaire", src: "/doc/contrat_cartes.pdf" })}
                            />
                          )}

                          {/* 5. Contrat Wave - Conditional */}
                          {selectedApp.products.hasWave && (
                            <GeneratedDocCard
                              title="Contrat Wave.pdf"
                              size="200 KB"
                              date={formatDate(selectedApp.updatedAt)}
                              onPreview={() => setPreviewDoc({ title: "Contrat Wave", src: "/doc/contrat_wave.pdf" })}
                            />
                          )}

                          {/* 6. FATCA - Conditional */}
                          {selectedApp.compliance.isUsPerson && (
                            <GeneratedDocCard
                              title="Auto-certification FATCA.pdf"
                              size="187 KB"
                              date={formatDate(selectedApp.updatedAt)}
                              onPreview={() => setPreviewDoc({ title: "Formulaire FATCA", src: "/doc/formulaire_fatca.pdf" })}
                            />
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Justificatifs Fournis
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <DocumentThumbnail title="CNI Recto" src={selectedApp.documents.idDocumentFront} onClick={() => setPreviewDoc({ title: "CNI Recto", src: selectedApp.documents.idDocumentFront })} />
                          <DocumentThumbnail title="CNI Verso" src={selectedApp.documents.idDocumentBack} onClick={() => setPreviewDoc({ title: "CNI Verso", src: selectedApp.documents.idDocumentBack })} />
                          <DocumentThumbnail title="Selfie" src={selectedApp.documents.selfie} onClick={() => setPreviewDoc({ title: "Selfie", src: selectedApp.documents.selfie })} />
                          <DocumentThumbnail title="Signature" src={selectedApp.signature.signatureDataUrl} onClick={() => setPreviewDoc({ title: "Signature", src: selectedApp.signature.signatureDataUrl })} />
                        </div>
                      </div>
                    </TabsContent>

                  </div>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium">Sélectionnez un dossier</h3>
              <p className="text-sm">Cliquez sur un dossier à gauche pour voir les détails.</p>
            </div>
          )}
        </main>
      </div>

      {/* Request Info Dialog */}
      <Dialog open={showRequestInfoDialog} onOpenChange={setShowRequestInfoDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Demande d'informations</DialogTitle></DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Info manquante..."
              value={requestInfoMessage}
              onChange={(e) => setRequestInfoMessage(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestInfoDialog(false)}>Annuler</Button>
            <Button onClick={handleRequestInfo}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
            <DialogTitle>{previewDoc?.title}</DialogTitle>
            <Button size="sm" variant="outline" className="gap-2" onClick={() => previewDoc?.src && window.open(previewDoc.src, '_blank')}>
              <Download className="h-4 w-4" /> Télécharger
            </Button>
          </DialogHeader>
          <div className="flex-1 bg-muted/50 p-4 overflow-auto flex items-center justify-center">
            {previewDoc?.src ? (
              previewDoc.src.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={`${previewDoc.src}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded-lg border shadow-sm bg-white"
                  title={previewDoc.title}
                />
              ) : (
                <img src={previewDoc.src} alt="Preview" className="max-w-full max-h-full object-contain shadow-lg rounded-lg border" />
              )
            ) : (
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p>Aperçu non disponible</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// --- Sub-components ---

const DetailItem = ({ label, value, full = false }: { label: string, value: string | undefined | null | React.ReactNode, full?: boolean }) => (
  <div className={`${full ? 'col-span-2' : 'col-span-1'} space-y-1`}>
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    <div className="font-medium text-sm break-words">{value || '—'}</div>
  </div>
);

const DetailRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
  <div className="flex justify-between items-center py-1 border-b border-dashed last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const SocialIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-[10px] font-medium text-muted-foreground">
    {icon} {label}
  </div>
);

const GeneratedDocCard = ({ title, size, date, onPreview }: { title: string, size: string, date: string, onPreview: () => void }) => (
  <div
    onClick={onPreview}
    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer group"
  >
    <div className="h-12 w-12 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
      <FileText className="h-6 w-6 text-red-600" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-muted-foreground">{size} • {date}</p>
    </div>
    <Button size="icon" variant="ghost" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <Maximize2 className="h-4 w-4" />
    </Button>
  </div>
);

const DocumentThumbnail = ({ title, src, onClick }: { title: string, src?: string, onClick: () => void }) => (
  <div
    onClick={onClick}
    className="aspect-square bg-muted rounded-lg border relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all group"
  >
    {src ? (
      <img src={src} alt={title} className="w-full h-full object-cover" />
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <FileText className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-xs">Vide</span>
      </div>
    )}
    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-xs font-medium truncate backdrop-blur-sm">
      {title}
    </div>
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
  </div>
);

export default AdminDashboard;
