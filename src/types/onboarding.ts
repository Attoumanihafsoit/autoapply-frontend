export type OnboardingMode = 'in-branch' | 'remote';
export type OnboardingStatus = 'draft' | 'submitted' | 'needs-info' | 'approved' | 'rejected';

// Step 1: Identification civile & coordonnées
export interface Step1CivilData {
    civility: 'M.' | 'Mme' | 'Mlle' | '';
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    nationality: string;
    address: string;
    phone: string;
    email: string;
    postalAddress?: string;
}

// Step 2: Pièce d'identité
export type IdDocumentType = 'cni' | 'passport' | 'other' | '';
export interface Step2IdentityDocData {
    idType: IdDocumentType;
    idNumber: string;
    idIssueDate: string;
    idIssuePlace: string;
    idExpiryDate: string;
}

// Step 3: Situation professionnelle
export interface Step3ProfessionData {
    profession: string;
    employer: string;
    employedSince: string; // MM/YYYY format
}

// Step 4: Services bancaires souhaités
export type CardType = 'azur' | 'elite' | 'platine' | '';
export interface Step4ServicesData {
    openIndividualAccount: 'yes' | 'no' | '';
    requestCheckbook: 'yes' | 'no' | '';
    numberOfCheckbooks?: number;
    checkbookType?: 'crossed' | 'uncrossed' | '';
    requestCard: 'yes' | 'no' | '';
    cardType?: CardType;
    activateOrangeMoney: 'yes' | 'no' | '';
    orangeMoneyNumber?: string;
    orangeMoneyAction?: 'activation' | 'deactivation' | '';
}

// Step 5: Informations bancaires
export interface Step5BankingData {
    branchCode: string; // 4 digits
    accountNumber: string; // 11 digits
    ribKey: string; // 2 digits
    agencyName: string;
    bankReferences?: string;
}

// Step 6: Vérification biométrique
export interface Step6BiometricData {
    idFrontImage?: string;
    idBackImage?: string;
    selfieImage?: string;
    livenessScore?: number;
    faceMatchScore?: number;
    livenessPassed: boolean;
    faceMatchPassed: boolean;
}

export interface TimelineEvent {
    id: string;
    type: 'created' | 'id-uploaded' | 'fields-extracted' | 'signed' | 'submitted' | 'approved' | 'rejected' | 'info-requested';
    timestamp: string;
    description: string;
    actor?: string;
}

export interface OnboardingData {
    id: string;
    mode: OnboardingMode;
    status: OnboardingStatus;
    currentStep: number;

    step1: Step1CivilData;
    step2: Step2IdentityDocData;
    step3: Step3ProfessionData;
    step4: Step4ServicesData;
    step5: Step5BankingData;
    step6: Step6BiometricData;

    createdAt: string;
    updatedAt: string;
    timeline: TimelineEvent[];
}

export const createEmptyOnboarding = (mode: OnboardingMode): OnboardingData => ({
    id: crypto.randomUUID(),
    mode,
    status: 'draft',
    currentStep: 0,
    step1: {
        civility: '',
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        nationality: 'senegalese',
        address: '',
        phone: '',
        email: '',
        postalAddress: '',
    },
    step2: {
        idType: '',
        idNumber: '',
        idIssueDate: '',
        idIssuePlace: '',
        idExpiryDate: '',
    },
    step3: {
        profession: '',
        employer: '',
        employedSince: '',
    },
    step4: {
        openIndividualAccount: '',
        requestCheckbook: '',
        requestCard: '',
        activateOrangeMoney: '',
    },
    step5: {
        branchCode: '',
        accountNumber: '',
        ribKey: '',
        agencyName: '',
        bankReferences: '',
    },
    step6: {
        livenessPassed: false,
        faceMatchPassed: false,
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

export const AGENCIES = [
    { value: 'dakar-plateau', label: 'Dakar - Plateau', code: '0010' },
    { value: 'dakar-almadies', label: 'Dakar - Almadies', code: '0020' },
    { value: 'dakar-medina', label: 'Dakar - Médina', code: '0030' },
    { value: 'thies', label: 'Thiès', code: '0040' },
    { value: 'saint-louis', label: 'Saint-Louis', code: '0050' },
    { value: 'kaolack', label: 'Kaolack', code: '0060' },
    { value: 'ziguinchor', label: 'Ziguinchor', code: '0070' },
];

export const BRANCHES = AGENCIES; // Temporary alias for old components

export const MONTHLY_VOLUMES = [
    { value: '0-500000', label: '0 - 500 000 FCFA' },
    { value: '500000-2000000', label: '500 000 - 2 000 000 FCFA' },
    { value: '2000000-10000000', label: '2 000 000 - 10 000 000 FCFA' },
    { value: '10000000+', label: '> 10 000 000 FCFA' },
];
