
export type OnboardingMode = 'in-branch' | 'remote';
export type OnboardingStatus = 'draft' | 'submitted' | 'needs-info' | 'approved' | 'rejected';
export type IdDocumentType = 'cni' | 'passport' | 'consular';

// Step 1: Identity (Formulaire EER)
export interface IdentityData {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    nationality: string;
    phone: string;
    email: string;
    address: string;

    // Filiation
    fatherFirstName: string;
    motherFirstName: string;
    motherLastName: string;

    // Profil
    occupation: string;

    // ID Details
    idNumber: string;
    idIssueDate: string;

    // Emergency
    emergencyContactName: string;
    emergencyContactPhone: string;
}

// Step 2: Documents (Justificatifs)
export interface DocumentsData {
    idDocumentFront?: string;
    idDocumentBack?: string;
    selfie?: string;
}

// Step 3: Accounts (BIMAO Particuliers & Sociétés)
export interface CorporateDocs {
    delegation: boolean;
    statuts: boolean;
    pouvoirs: boolean;
    rccm: boolean;
    specimen: boolean;
    autres: string; // If populated, checked
}

export interface BankingData {
    accountInfoType: 'individual' | 'corporate';

    // Common / Existing
    agency: string;
    initialDeposit: string;
    hasMailbox: boolean; // "Voulez-vous qu'une boîte à lettre vous soit attribuée ?"
    accountFees?: string;

    // Particuliers (Individuals)
    postalAddress: string;
    employer: string;
    employedSince: string;
    profession: string;
    idIssueDetails: string; // Date et lieu d'émission

    // Sociétés (Corporate)
    companyName: string;
    headquarters: string; // Siège social
    mailingAddress: string; // Courrier à adresser à
    legalForm: string; // SA, SARL, etc.
    hasRelatedAccounts: boolean; // "Ce compte est-il en relation..."
    isMainAccount: boolean;
    mainAccountNumber: string; // If !isMainAccount
    mergeInterests: boolean; // "Les intérêts et frais doivent-ils être comptabilisés..."
    bankingReferences: string;
    maintenanceFees: string; // "Frais de tenue de compte CFA trimestriellement"
    keepExtracts: boolean; // "Les extraits sont-ils à garder chez nous ?"
    otherReferences: string;
    introducedBy: string;

    // Corporate Docs Checklist
    submittedDocs: CorporateDocs;

    // Réservé Banque
    checkbookAuthorized: boolean;
    orderBookAuthorized: boolean;
    waitForInfo: boolean;
    waitForFunds: boolean;
    bankComments: string; // Remarques
}

// ... (ProductsData)

// ...

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
        nationality: 'senegalese',
        phone: '',
        email: '',
        address: '',
        fatherFirstName: '',
        motherFirstName: '',
        motherLastName: '',
        occupation: '',
        idNumber: '',
        idIssueDate: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
    },
    documents: {
        idDocumentFront: undefined,
        idDocumentBack: undefined,
        selfie: undefined,
    },
    banking: {
        accountInfoType: 'individual',
        agency: '',
        initialDeposit: '',
        hasMailbox: false,

        // Individual Defaults
        postalAddress: '',
        employer: '',
        employedSince: '',
        profession: '',
        idIssueDetails: '',

        // Corporate Defaults
        companyName: '',
        headquarters: '',
        mailingAddress: '',
        legalForm: '',
        hasRelatedAccounts: false,
        isMainAccount: true,
        mainAccountNumber: '',
        mergeInterests: false,
        bankingReferences: '',
        maintenanceFees: '',
        keepExtracts: false,
        otherReferences: '',
        introducedBy: '',

        submittedDocs: {
            delegation: false,
            statuts: false,
            pouvoirs: false,
            rccm: false,
            specimen: false,
            autres: ''
        },

        // Bank Reserve
        checkbookAuthorized: false,
        orderBookAuthorized: false,
        waitForInfo: false,
        waitForFunds: false,
        bankComments: ''
    },
    products: {
        cardType: 'none',
        branchCode: '00000',
        hasWave: false,
        waveDetails: {
            idType: 'cni',
            idCountry: 'SN',
            idNumber: '',
            activationCode: ''
        }
    },
    compliance: {
        isUsPerson: false,
        isExclusiveTaxResidentSenegal: true,
        taxResidences: [],
        sourceOfFunds: '',
        monthlyVolume: '',
        isPep: false,
        bicAccountNumber: '',
        creditInfoConsent: false,
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

// Step 4: Products (Carte & Wave)
export interface ProductsData {
    // Card
    cardType: 'azur' | 'elite' | 'platine' | 'none';
    branchCode: string; // Code Guichet
    accountNumber?: string; // N° de Compte
    companyName?: string; // Raison Sociale

    // Wave
    hasWave: boolean;
    waveDetails?: {
        activationCode: string;
        idType: IdDocumentType;
        idCountry: string;
        idNumber: string;
    };
}

// Step 5: Compliance (BIC & FATCA)
export interface TaxResidence {
    country: string;
    nif: string; // Numéro d'Identification Fiscale
}

export interface ComplianceData {
    // FATCA
    isUsPerson: boolean;
    isExclusiveTaxResidentSenegal: boolean; // New toggle
    taxResidences: TaxResidence[]; // Dynamic list

    // Regulatory / Common
    sourceOfFunds: string;
    monthlyVolume: string;
    isPep: boolean;

    // BIC (Credit Bureau)
    bicAccountNumber: string; // Numéro de compte pour BIC
    creditInfoConsent: boolean; // Global consent or specific checkboxes
}

// Step 7: Signature
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
    documents: DocumentsData;
    banking: BankingData;
    products: ProductsData;
    compliance: ComplianceData;
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

// --- Constants ---

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

export const BRANCHES = [
    { value: 'dakar-plateau', label: 'Dakar - Plateau' },
    { value: 'dakar-almadies', label: 'Dakar - Almadies' },
    { value: 'dakar-medina', label: 'Dakar - Médina' },
    { value: 'thies', label: 'Thiès' },
    { value: 'saint-louis', label: 'Saint-Louis' },
    { value: 'kaolack', label: 'Kaolack' },
    { value: 'ziguinchor', label: 'Ziguinchor' },
];



export const DEMO_DATA: Partial<OnboardingData> = {
    // We will populate this partially to help the user only fill new fields
};
