import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Check, X, MessageSquare, Clock, User, Building2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import type { OnboardingData, OnboardingStatus } from '@/types/onboarding';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr as frLocale, enUS } from 'date-fns/locale';

// Demo applications for initial state
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
      address: '45 Avenue Cheikh Anta Diop, Dakar',
    },
    banking: {
      accountNumber: 'SN098765432101',
      branch: 'dakar-almadies',
      preferredChannel: 'hybrid',
      activationCode: 'ACT-2024-002',
    },
    regulatory: {
      isUsPerson: false,
      sourceOfFunds: 'salary',
      expectedMonthlyVolume: '500000-2000000',
      occupation: 'Médecin / Hôpital Principal',
      isPep: false,
    },
    products: {
      currentAccount: true,
      bankCard: true,
      waveWallet: false,
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
      { id: '2', type: 'id-uploaded', timestamp: '2024-01-15T09:35:00Z', description: 'Pièce d\'identité téléchargée', actor: 'Fatou Sow' },
      { id: '3', type: 'signed', timestamp: '2024-01-15T10:40:00Z', description: 'Documents signés', actor: 'Fatou Sow' },
      { id: '4', type: 'submitted', timestamp: '2024-01-15T10:45:00Z', description: 'Dossier soumis', actor: 'System' },
    ],
  },
  {
    id: 'demo-2',
    mode: 'remote',
    status: 'approved',
    currentStep: 5,
    identity: {
      firstName: 'Moussa',
      lastName: 'Ba',
      dateOfBirth: '1985-08-10',
      placeOfBirth: 'Saint-Louis',
      nationality: 'senegalese',
      phone: '+221 77 345 67 89',
      address: '78 Rue de la République, Saint-Louis',
    },
    banking: {
      accountNumber: 'SN112233445566',
      branch: 'saint-louis',
      preferredChannel: 'online',
      activationCode: 'ACT-2024-003',
    },
    regulatory: {
      isUsPerson: false,
      sourceOfFunds: 'business',
      expectedMonthlyVolume: '2000000-10000000',
      occupation: 'Entrepreneur / Commerce',
      isPep: false,
    },
    products: {
      currentAccount: true,
      bankCard: true,
      waveWallet: true,
      waveDetails: {
        idType: 'cni',
        idCountry: 'Sénégal',
        idNumber: '1234567890123',
      },
    },
    signature: {
      readAndApproved: true,
      signatureDate: '2024-01-10',
      signatureLocation: 'Saint-Louis',
    },
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-12T11:30:00Z',
    timeline: [
      { id: '1', type: 'created', timestamp: '2024-01-10T14:00:00Z', description: 'Onboarding créé', actor: 'System' },
      { id: '2', type: 'submitted', timestamp: '2024-01-10T15:30:00Z', description: 'Dossier soumis', actor: 'System' },
      { id: '3', type: 'approved', timestamp: '2024-01-12T11:30:00Z', description: 'Dossier approuvé', actor: 'Admin' },
    ],
  },
  {
    id: 'demo-3',
    mode: 'in-branch',
    status: 'needs-info',
    currentStep: 3,
    identity: {
      firstName: 'Aïssatou',
      lastName: 'Diop',
      dateOfBirth: '1992-12-05',
      placeOfBirth: 'Kaolack',
      nationality: 'senegalese',
      phone: '+221 76 456 78 90',
      address: '',
    },
    banking: {
      accountNumber: '',
      branch: 'kaolack',
      preferredChannel: 'in-branch',
      activationCode: '',
    },
    regulatory: {
      isUsPerson: false,
      sourceOfFunds: '',
      expectedMonthlyVolume: '',
      occupation: 'Enseignante',
      isPep: false,
    },
    products: {
      currentAccount: true,
      bankCard: false,
      waveWallet: false,
    },
    signature: {
      readAndApproved: false,
      signatureDate: '',
      signatureLocation: '',
    },
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z',
    timeline: [
      { id: '1', type: 'created', timestamp: '2024-01-18T08:00:00Z', description: 'Onboarding créé', actor: 'Conseiller' },
      { id: '2', type: 'info-requested', timestamp: '2024-01-18T09:15:00Z', description: 'Informations manquantes demandées', actor: 'Admin' },
    ],
  },
];

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<OnboardingData[]>([]);
  const [selectedApp, setSelectedApp] = useState<OnboardingData | null>(null);
  const [showRequestInfoDialog, setShowRequestInfoDialog] = useState(false);
  const [requestInfoMessage, setRequestInfoMessage] = useState('');

  useEffect(() => {
    // Load applications from localStorage, merge with demo data
    const saved = JSON.parse(localStorage.getItem('autoapply_applications') || '[]');
    const demoIds = DEMO_APPLICATIONS.map(d => d.id);
    const userApps = saved.filter((app: OnboardingData) => !demoIds.includes(app.id));
    setApplications([...DEMO_APPLICATIONS, ...userApps]);
  }, []);

  const handleStatusChange = (appId: string, newStatus: OnboardingStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: newStatus,
              timeline: [
                ...app.timeline,
                {
                  id: crypto.randomUUID(),
                  type: newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'info-requested',
                  timestamp: new Date().toISOString(),
                  description: newStatus === 'approved' ? 'Dossier approuvé' : newStatus === 'rejected' ? 'Dossier rejeté' : 'Informations demandées',
                  actor: 'Admin',
                },
              ],
            }
          : app
      )
    );
    
    toast.success(
      language === 'fr'
        ? `Statut mis à jour: ${t(`admin.status.${newStatus.replace('-', '')}` as any)}`
        : `Status updated: ${newStatus}`
    );
    setSelectedApp(null);
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
      return format(new Date(dateString), 'dd MMM yyyy HH:mm', {
        locale: language === 'fr' ? frLocale : enUS,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
          <p className="text-muted-foreground">{t('admin.applications')}</p>
        </div>

        {/* Applications Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.applicant')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead>{t('admin.channel')}</TableHead>
                <TableHead>{t('admin.createdAt')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {app.identity.firstName} {app.identity.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{app.identity.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {app.mode === 'in-branch' ? (
                        <>
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{t('mode.inBranch.title')}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span>{t('mode.remote.title')}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(app.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t('common.view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedApp && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p>
                        {selectedApp.identity.firstName} {selectedApp.identity.lastName}
                      </p>
                      <StatusBadge status={selectedApp.status} />
                    </div>
                  </DialogTitle>
                </DialogHeader>

                {/* Timeline */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4">{t('admin.timeline')}</h3>
                  <div className="space-y-4">
                    {selectedApp.timeline.map((event, i) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          {i < selectedApp.timeline.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium">{event.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(event.timestamp)} • {event.actor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <DialogFooter className="gap-2 sm:gap-0 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/onboarding/documents/${selectedApp.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('documents.title')}
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    >
                      <X className="h-4 w-4 mr-1" />
                      {t('admin.action.reject')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowRequestInfoDialog(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t('admin.action.requestInfo')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {t('admin.action.approve')}
                    </Button>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Request Info Dialog */}
        <Dialog open={showRequestInfoDialog} onOpenChange={setShowRequestInfoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.action.requestInfo')}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder={language === 'fr' ? 'Décrivez les informations manquantes...' : 'Describe missing information...'}
                value={requestInfoMessage}
                onChange={(e) => setRequestInfoMessage(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestInfoDialog(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleRequestInfo}>
                <Send className="h-4 w-4 mr-2" />
                {language === 'fr' ? 'Envoyer' : 'Send'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

// Add missing import
import { Send } from 'lucide-react';

export default AdminDashboard;
