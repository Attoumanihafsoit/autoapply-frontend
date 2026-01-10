export type OnboardingMode = 'in-branch' | 'remote';

export type OnboardingStatus = 'draft' | 'submitted' | 'needs-info' | 'approved' | 'rejected';

export type IdDocumentType = 'cni' | 'passport' | 'consular';

export interface IdentityData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  phone: string;
  address: string;
  idDocumentFront?: string;
  idDocumentBack?: string;
  selfie?: string;
}

export interface BankingData {
  accountNumber: string;
  branch: string;
  preferredChannel: 'in-branch' | 'online' | 'hybrid';
  activationCode: string;
}

export interface RegulatoryData {
  isUsPerson: boolean;
  usPersonDetails?: string;
  sourceOfFunds: string;
  sourceOfFundsDetails?: string;
  expectedMonthlyVolume: string;
  occupation: string;
  isPep: boolean;
}

export interface ProductsData {
  currentAccount: boolean;
  bankCard: boolean;
  waveWallet: boolean;
  waveDetails?: {
    idType: IdDocumentType;
    idCountry: string;
    idNumber: string;
  };
}

export interface SignatureData {
  signatureDataUrl?: string;
  readAndApproved: boolean;
  signatureDate: string;
  signatureLocation: string;
}

export interface OnboardingData {
  id: string;
  mode: OnboardingMode;
  status: OnboardingStatus;
  currentStep: number;
  identity: IdentityData;
  banking: BankingData;
  regulatory: RegulatoryData;
  products: ProductsData;
  signature: SignatureData;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'id-uploaded' | 'fields-extracted' | 'signed' | 'submitted' | 'approved' | 'rejected' | 'info-requested';
  timestamp: string;
  description: string;
  actor?: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  nameFr: string;
  completionScore: number;
  mappedFields: { source: string; target: string; value: string }[];
  missingFields: string[];
  status: 'complete' | 'partial' | 'missing';
}

export const BRANCHES = [
  { value: 'dakar-plateau', label: 'Dakar - Plateau' },
  { value: 'dakar-almadies', label: 'Dakar - Almadies' },
  { value: 'dakar-medina', label: 'Dakar - Médina' },
  { value: 'thies', label: 'Thiès' },
  { value: 'saint-louis', label: 'Saint-Louis' },
  { value: 'kaolack', label: 'Kaolack' },
  { value: 'ziguinchor', label: 'Ziguinchor' },
];

export const NATIONALITIES = [
  { value: 'senegalese', label: 'Sénégalaise', labelEn: 'Senegalese' },
  { value: 'malian', label: 'Malienne', labelEn: 'Malian' },
  { value: 'ivorian', label: 'Ivoirienne', labelEn: 'Ivorian' },
  { value: 'guinean', label: 'Guinéenne', labelEn: 'Guinean' },
  { value: 'burkinabe', label: 'Burkinabè', labelEn: 'Burkinabe' },
  { value: 'french', label: 'Française', labelEn: 'French' },
  { value: 'other', label: 'Autre', labelEn: 'Other' },
];

export const MONTHLY_VOLUMES = [
  { value: '0-500000', label: '0 - 500 000 FCFA' },
  { value: '500000-2000000', label: '500 000 - 2 000 000 FCFA' },
  { value: '2000000-10000000', label: '2 000 000 - 10 000 000 FCFA' },
  { value: '10000000+', label: '> 10 000 000 FCFA' },
];

export const createEmptyOnboarding = (mode: OnboardingMode): OnboardingData => ({
  id: crypto.randomUUID(),
  mode,
  status: 'draft',
  currentStep: 0,
  identity: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    phone: '',
    address: '',
  },
  banking: {
    accountNumber: '',
    branch: '',
    preferredChannel: 'in-branch',
    activationCode: '',
  },
  regulatory: {
    isUsPerson: false,
    sourceOfFunds: '',
    expectedMonthlyVolume: '',
    occupation: '',
    isPep: false,
  },
  products: {
    currentAccount: false,
    bankCard: false,
    waveWallet: false,
  },
  signature: {
    readAndApproved: false,
    signatureDate: new Date().toISOString().split('T')[0],
    signatureLocation: '',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  timeline: [
    {
      id: crypto.randomUUID(),
      type: 'created',
      timestamp: new Date().toISOString(),
      description: 'Onboarding créé',
      actor: 'System',
    },
  ],
});

export const DEMO_DATA: Partial<IdentityData & BankingData> = {
  firstName: 'Amadou',
  lastName: 'Diallo',
  dateOfBirth: '1985-06-15',
  placeOfBirth: 'Dakar',
  nationality: 'senegalese',
  phone: '+221 77 123 45 67',
  address: '12 Rue Félix Faure, Dakar Plateau, Sénégal',
  accountNumber: 'SN012345678901',
  branch: 'dakar-plateau',
  activationCode: 'ACT-2024-001',
};
