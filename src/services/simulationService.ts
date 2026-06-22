import { OnboardingData } from '@/types/onboarding';

export interface SimulationResult {
    identityVerified: boolean;
    amlCompliant: boolean;
    riskScore: string;
    generatedDocuments: GeneratedDocument[];
}

export interface GeneratedDocument {
    id: string;
    name: string;
    url: string; // Path to public/doc
    type: 'contract' | 'form' | 'disclosure';
}

export const simulationService = {
    runChecks: async (data: OnboardingData): Promise<SimulationResult> => {
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            identityVerified: true,
            amlCompliant: true,
            riskScore: 'LOW',
            generatedDocuments: [
                {
                    id: 'doc_1',
                    name: 'COMPTES PARTICULIERS',
                    url: '/doc/COMPTES PARTICULIERS (002).pdf',
                    type: 'form'
                },
                ...(data.step4?.requestCard === 'yes' ? [{
                    id: 'doc_2',
                    name: 'CONTRAT DE SOUSCRIPTION CARTES',
                    url: '/doc/CONTRAT DE SOUSCRIPTION CARTES (1).pdf',
                    type: 'contract' as const
                }] : []),
                ...(data.step4?.activateOrangeMoney === 'yes' ? [{
                    id: 'doc_3',
                    name: 'CONTRAT OMBA CLIENT',
                    url: '/doc/CONTRAT OMBA CLIENT avec nouveau  plafond.pdf',
                    type: 'contract' as const
                }] : []),
                ...(data.step4?.requestCheckbook === 'yes' ? [{
                    id: 'doc_4',
                    name: 'DEMANDE DE CHEQUIER',
                    url: '/doc/DEMANDE DE CHEQUIER.pdf',
                    type: 'form' as const
                }] : []),
            ]
        };
    }
};
