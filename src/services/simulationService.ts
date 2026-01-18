
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
                    name: 'Ouverture de Compte Particulier',
                    url: '/doc/comptes_particuliers.pdf',
                    type: 'form'
                },
                ...(data.products.cardType !== 'none' ? [{
                    id: 'doc_2',
                    name: 'Contrat Carte Bancaire',
                    url: '/doc/contrat_cartes.pdf',
                    type: 'contract' as const
                }] : []),
                ...(data.products.hasWave ? [{
                    id: 'doc_3',
                    name: 'Contrat Wave',
                    url: '/doc/contrat_wave.pdf',
                    type: 'contract' as const
                }] : []),
                {
                    id: 'doc_4',
                    name: 'Formulaire BIC (Crédit Bureau)',
                    url: '/doc/formulaire_bic.pdf',
                    type: 'disclosure'
                },
                {
                    id: 'doc_5',
                    name: 'Formulaire FATCA',
                    url: '/doc/formulaire_fatca.pdf',
                    type: 'disclosure'
                },
                {
                    id: 'doc_6',
                    name: 'Formulaire EER',
                    url: '/doc/formulaire_eer.pdf',
                    type: 'form'
                }
            ]
        };
    }
};
