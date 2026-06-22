import * as z from 'zod';

export const step1Schema = z.object({
  civility: z.enum(['M.', 'Mme', 'Mlle'], { required_error: 'La civilité est requise' }),
  lastName: z.string().min(1, 'Le nom de famille est requis').toUpperCase(),
  firstName: z.string().min(1, 'Le prénom est requis'),
  dateOfBirth: z.string().min(1, 'La date de naissance est requise').refine((date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }, "Vous devez avoir au moins 18 ans pour ouvrir un compte"),
  placeOfBirth: z.string().min(1, 'Le lieu de naissance est requis'),
  nationality: z.string().min(1, 'La nationalité est requise'),
  address: z.string().min(1, 'L\'adresse de domicile est requise'),
  phone: z.string().regex(/^(\+221|7)[0-9]{8}$/, 'Numéro invalide. Format requis: 7X XXX XXXX ou +2217X XXX XXXX'),
  email: z.string().email('Adresse email invalide'),
  postalAddress: z.string().optional(),
});

export const step2Schema = z.object({
  idType: z.enum(['cni', 'passport', 'other'], { required_error: 'Le type de pièce est requis' }),
  idNumber: z.string().min(1, 'Le numéro de la pièce est requis'),
  idIssueDate: z.string().min(1, 'La date d\'émission est requise'),
  idIssuePlace: z.string().min(1, 'Le lieu d\'émission est requis'),
  idExpiryDate: z.string().min(1, 'La date d\'expiration est requise').refine((date) => {
    const today = new Date();
    const expiryDate = new Date(date);
    // Expiration > 6 mois (approx 180 jours)
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 180;
  }, "Votre pièce est expirée ou expire dans moins de 6 mois. Veuillez en fournir une valide."),
});

export const step3Schema = z.object({
  profession: z.string().min(1, 'La profession est requise'),
  employer: z.string().min(1, 'Le nom de l\'employeur est requis (Indiquez "Sans emploi" si applicable)'),
  employedSince: z.string().min(1, 'L\'ancienneté est requise (Mois/Année)'),
});

export const step4Schema = z.object({
  openIndividualAccount: z.enum(['yes', 'no'], { required_error: 'Veuillez indiquer si vous souhaitez ouvrir un compte' }),
  requestCheckbook: z.enum(['yes', 'no']).optional(),
  numberOfCheckbooks: z.number().int().min(1, 'Veuillez indiquer le nombre de carnets').optional().or(z.literal(0)),
  checkbookType: z.enum(['crossed', 'uncrossed', '']).optional(),
  requestCard: z.enum(['yes', 'no']).optional(),
  cardType: z.enum(['azur', 'elite', 'platine', '']).optional(),
  activateOrangeMoney: z.enum(['yes', 'no']).optional(),
  orangeMoneyNumber: z.string().optional(),
  orangeMoneyAction: z.enum(['activation', 'deactivation', '']).optional(),
}).superRefine((data, ctx) => {
  if (data.openIndividualAccount === 'yes' && !data.requestCheckbook) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ce champ est requis', path: ['requestCheckbook'] });
  }
  if (data.requestCheckbook === 'yes') {
    if (!data.numberOfCheckbooks || data.numberOfCheckbooks < 1) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Veuillez indiquer le nombre de carnets', path: ['numberOfCheckbooks'] });
    }
    if (!data.checkbookType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ce champ est requis', path: ['checkbookType'] });
    }
  }
  if (data.activateOrangeMoney === 'yes') {
    if (!data.orangeMoneyNumber || !/^(7)[0-9]{8}$/.test(data.orangeMoneyNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Numéro Orange Money invalide', path: ['orangeMoneyNumber'] });
    }
    if (!data.orangeMoneyAction) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Veuillez choisir une action', path: ['orangeMoneyAction'] });
    }
  }
});

export const step5Schema = z.object({
  branchCode: z.string().length(4, 'Le code guichet doit comporter 4 chiffres'),
  accountNumber: z.string().length(11, 'Numéro de compte invalide (11 chiffres requis)'),
  ribKey: z.string().length(2, 'La clé RIB doit comporter 2 chiffres'),
  agencyName: z.string().min(1, 'Veuillez sélectionner une agence'),
  bankReferences: z.string().optional(),
});

export const step6Schema = z.object({
  idFrontImage: z.string().optional(),
  livenessPassed: z.boolean().refine(val => val === true, { message: 'Vérification liveness échouée. Veuillez réessayer.' }),
  faceMatchPassed: z.boolean().refine(val => val === true, { message: 'Correspondance visage non confirmée. Réessayez.' }),
});

export const onboardingSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
