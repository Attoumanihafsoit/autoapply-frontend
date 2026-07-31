import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: {
    fr: string;
    en: string;
  };
}

export const translations: Translations = {
  // Header
  'nav.home': { fr: 'Accueil', en: 'Home' },
  'nav.dashboard': { fr: 'Tableau de bord', en: 'Dashboard' },
  'nav.newOnboarding': { fr: 'Nouvelle demande', en: 'New Onboarding' },
  
  // Landing Page
  'hero.title': { fr: 'AutoApply', en: 'AutoApply' },
  'hero.subtitle': { fr: 'Un formulaire d\'accueil. Tous les documents bancaires générés.', en: 'One onboarding form. All bank documents generated.' },
  'hero.description': { fr: 'Pour l\'accueil en agence ou à distance. Plus rapide, conforme, prêt pour l\'audit.', en: 'For in-branch or remote onboarding. Faster, compliant, audit-ready.' },
  'hero.cta.start': { fr: 'Démarrer un Onboarding', en: 'Start a New Onboarding' },
  'hero.cta.demo': { fr: 'Voir le Dashboard Admin (Démo)', en: 'View Admin Dashboard (Demo)' },
  
  // Features
  'feature.form.title': { fr: 'Un seul formulaire', en: 'One form for the customer' },
  'feature.form.description': { fr: 'Le client remplit un unique formulaire intelligent qui capture toutes les informations nécessaires.', en: 'Customer fills one smart form that captures all required information.' },
  'feature.autofill.title': { fr: 'Auto-remplissage + e-signature', en: 'Auto-fill bank PDFs + e-sign' },
  'feature.autofill.description': { fr: 'Les documents bancaires sont pré-remplis automatiquement et signés électroniquement.', en: 'Bank documents are auto-filled and electronically signed.' },
  'feature.audit.title': { fr: 'Piste d\'audit + Export sécurisé', en: 'Audit trail + secure export' },
  'feature.audit.description': { fr: 'Chaque action est tracée. Export complet pour la conformité.', en: 'Every action logged. Complete export for compliance.' },
  
  // Onboarding Mode
  'mode.title': { fr: 'Choisir le mode d\'onboarding', en: 'Choose Onboarding Mode' },
  'mode.inBranch.title': { fr: 'En agence', en: 'In-branch' },
  'mode.inBranch.description': { fr: 'Accompagnement par un conseiller bancaire', en: 'Banker-assisted onboarding' },
  'mode.remote.title': { fr: 'À distance', en: 'Remote' },
  'mode.remote.description': { fr: 'Le client complète lui-même le processus', en: 'Customer self-serve onboarding' },
  
  // Steps
  'step.identity': { fr: 'Identité', en: 'Identity' },
  'step.banking': { fr: 'Coordonnées bancaires', en: 'Banking Details' },
  'step.regulatory': { fr: 'Déclarations réglementaires', en: 'Regulatory Declarations' },
  'step.products': { fr: 'Produits', en: 'Products' },
  'step.review': { fr: 'Vérification & Signature', en: 'Review & e-Signature' },
  
  // Identity Form
  'identity.firstName': { fr: 'Prénom(s)', en: 'First name(s)' },
  'identity.lastName': { fr: 'Nom de famille', en: 'Last name' },
  'identity.dob': { fr: 'Date de naissance', en: 'Date of birth' },
  'identity.pob': { fr: 'Lieu de naissance', en: 'Place of birth' },
  'identity.nationality': { fr: 'Nationalité', en: 'Nationality' },
  'identity.phone': { fr: 'Numéro de téléphone', en: 'Phone number' },
  'identity.address': { fr: 'Adresse', en: 'Address' },
  'identity.idUpload': { fr: 'Télécharger la pièce d\'identité (recto/verso)', en: 'Upload ID document (front/back)' },
  'identity.selfie': { fr: 'Selfie (optionnel)', en: 'Selfie (optional)' },
  'identity.scanId': { fr: 'Scanner la pièce d\'identité (Démo)', en: 'Scan ID (Demo)' },
  
  // Banking Form
  'banking.accountNumber': { fr: 'Numéro de compte (si existant)', en: 'Account number (if existing)' },
  'banking.branch': { fr: 'Agence', en: 'Branch / Agency' },
  'banking.channel': { fr: 'Canal préféré', en: 'Preferred channel' },
  'banking.channel.inBranch': { fr: 'En agence', en: 'In-branch' },
  'banking.channel.online': { fr: 'En ligne', en: 'Online' },
  'banking.channel.hybrid': { fr: 'Hybride', en: 'Hybrid' },
  'banking.activationCode': { fr: 'Code d\'activation', en: 'Activation code' },
  'banking.activationTooltip': { fr: 'Utilisé pour la connectivité Wave/Wallet', en: 'Used for Wave/Wallet connectivity pack' },
  
  // Regulatory Form
  'regulatory.fatca.title': { fr: 'Déclaration FATCA', en: 'FATCA Declaration' },
  'regulatory.fatca.usPerson': { fr: 'Êtes-vous une US Person?', en: 'Are you a US Person?' },
  'regulatory.sourceOfFunds': { fr: 'Source des fonds', en: 'Source of funds' },
  'regulatory.sourceOfFunds.salary': { fr: 'Salaire', en: 'Salary' },
  'regulatory.sourceOfFunds.business': { fr: 'Activité commerciale', en: 'Business income' },
  'regulatory.sourceOfFunds.inheritance': { fr: 'Héritage', en: 'Inheritance' },
  'regulatory.sourceOfFunds.savings': { fr: 'Épargne', en: 'Savings' },
  'regulatory.sourceOfFunds.other': { fr: 'Autre', en: 'Other' },
  'regulatory.monthlyVolume': { fr: 'Volume mensuel prévu', en: 'Expected monthly volume' },
  'regulatory.occupation': { fr: 'Profession / Employeur', en: 'Occupation / Employer' },
  'regulatory.pep': { fr: 'Personne politiquement exposée (PPE)', en: 'Politically Exposed Person (PEP)' },
  
  // Products
  'products.title': { fr: 'Produits à souscrire', en: 'Products to Subscribe' },
  'products.currentAccount': { fr: 'Compte courant', en: 'Current account' },
  'products.bankCard': { fr: 'Souscription carte bancaire', en: 'Bank card subscription' },
  'products.wave': { fr: 'Service de transfert Wave / Wallet (B2W WAVE)', en: 'Wave / Wallet transfer service (B2W WAVE)' },
  'products.wave.idType': { fr: 'Type de pièce d\'identité', en: 'ID Type' },
  'products.wave.idType.cni': { fr: 'CNI', en: 'National ID' },
  'products.wave.idType.passport': { fr: 'Passeport', en: 'Passport' },
  'products.wave.idType.consular': { fr: 'Carte consulaire', en: 'Consular Card' },
  'products.wave.idCountry': { fr: 'Pays de délivrance', en: 'ID Country' },
  'products.wave.idNumber': { fr: 'Numéro de la pièce', en: 'ID Number' },
  
  // Review
  'review.title': { fr: 'Récapitulatif de la demande', en: 'Review Summary' },
  'review.signature': { fr: 'Signature électronique', en: 'Electronic Signature' },
  'review.signaturePad': { fr: 'Dessiner votre signature ci-dessous', en: 'Draw your signature below' },
  'review.readApproved': { fr: 'Lu et approuvé', en: 'Read and approved' },
  'review.signatureDate': { fr: 'Date de signature', en: 'Signature date' },
  'review.signatureLocation': { fr: 'Lieu de signature', en: 'Signature location' },
  'review.generatePack': { fr: 'Générer le Pack de Documents (Démo)', en: 'Generate Completed Document Pack (Demo)' },
  
  // Documents
  'documents.title': { fr: 'Pack de documents', en: 'Document Pack' },
  'documents.preview': { fr: 'Aperçu du document', en: 'Document Preview' },
  'documents.mappedFields': { fr: 'Champs mappés', en: 'Mapped Fields' },
  'documents.completionScore': { fr: 'Score de complétion', en: 'Completion Score' },
  'documents.missingFields': { fr: 'Champs manquants', en: 'Missing Fields' },
  'documents.status.complete': { fr: 'Complet', en: 'Completed' },
  'documents.status.partial': { fr: 'Information requise', en: 'Needs info' },
  'documents.export.zip': { fr: 'Télécharger le Pack Complet (ZIP) — Démo', en: 'Download Onboarding Pack (ZIP) — Demo' },
  'documents.export.pdf': { fr: 'Télécharger les PDFs individuels — Démo', en: 'Download Individual PDFs — Demo' },
  'documents.export.send': { fr: 'Envoyer à la Banque pour Approbation — Démo', en: 'Send to Bank for Approval — Demo' },
  
  // Admin Dashboard
  'admin.title': { fr: 'Tableau de bord administrateur', en: 'Admin Dashboard' },
  'admin.applications': { fr: 'Demandes d\'onboarding', en: 'Onboarding Applications' },
  'admin.applicant': { fr: 'Demandeur', en: 'Applicant' },
  'admin.status': { fr: 'Statut', en: 'Status' },
  'admin.channel': { fr: 'Canal', en: 'Channel' },
  'admin.createdAt': { fr: 'Date de création', en: 'Created date' },
  'admin.status.draft': { fr: 'Brouillon', en: 'Draft' },
  'admin.status.submitted': { fr: 'Soumis', en: 'Submitted' },
  'admin.status.needsInfo': { fr: 'Information requise', en: 'Needs Info' },
  'admin.status.approved': { fr: 'Approuvé', en: 'Approved' },
  'admin.status.rejected': { fr: 'Rejeté', en: 'Rejected' },
  'admin.action.approve': { fr: 'Approuver', en: 'Approve' },
  'admin.action.requestInfo': { fr: 'Demander des informations', en: 'Request Info' },
  'admin.action.reject': { fr: 'Rejeter', en: 'Reject' },
  'admin.timeline': { fr: 'Historique', en: 'Timeline' },
  
  // Security Badges
  'security.encrypted': { fr: 'Données chiffrées en transit', en: 'Data encrypted in transit' },
  'security.piiRestricted': { fr: 'Accès aux données personnelles restreint', en: 'PII access restricted' },
  'security.auditLog': { fr: 'Journalisation d\'audit activée', en: 'Audit log enabled' },
  'security.rbac': { fr: 'Contrôle d\'accès par rôle (Conseiller/Admin)', en: 'Role-based access (Banker/Admin)' },
  
  // Messages
  'message.auditLogged': { fr: 'Toutes les sessions d\'onboarding sont journalisées pour la conformité.', en: 'All onboarding sessions are audit-logged for compliance.' },
  'message.bothModes': { fr: 'Supporte l\'onboarding assisté par conseiller et l\'onboarding client à distance.', en: 'Supports both banker-assisted and remote customer onboarding.' },
  
  // Common
  'common.next': { fr: 'Suivant', en: 'Next' },
  'common.previous': { fr: 'Précédent', en: 'Previous' },
  'common.save': { fr: 'Enregistrer', en: 'Save' },
  'common.cancel': { fr: 'Annuler', en: 'Cancel' },
  'common.yes': { fr: 'Oui', en: 'Yes' },
  'common.no': { fr: 'Non', en: 'No' },
  'common.loading': { fr: 'Chargement...', en: 'Loading...' },
  'common.view': { fr: 'Voir', en: 'View' },
  'common.details': { fr: 'Détails', en: 'Details' },
  'common.back': { fr: 'Retour', en: 'Back' },
  'common.clear': { fr: 'Effacer', en: 'Clear' },

// modifier 
    // Wizard steps labels
  'Civil & Contact': {
    fr: 'Civil & Contact',
    en: 'Civil & Contact'
  },

  'Pièce d\'identité': {
    fr: 'Pièce d\'identité',
    en: 'Identity document'
  },

  'Profession': {
    fr: 'Profession',
    en: 'Occupation'
  },

  'Services': {
    fr: 'Services',
    en: 'Services'
  },

  'Banque': {
    fr: 'Banque',
    en: 'Bank'
  },

  'Biométrie': {
    fr: 'Biométrie',
    en: 'Biometrics'
  },

  'Récapitulatif': {
    fr: 'Récapitulatif',
    en: 'Summary'
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
