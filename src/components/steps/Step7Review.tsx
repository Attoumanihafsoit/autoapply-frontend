import { useFormContext } from 'react-hook-form';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, User, FileText, Briefcase, CreditCard, Landmark, Fingerprint } from 'lucide-react';

export const Step7Review = () => {
  const { getValues } = useFormContext<OnboardingFormValues>();
  const data = getValues();

  const renderFieldValue = (value: string | number | boolean | undefined) => {
    if (value === undefined || value === '') return <span className="text-muted-foreground italic">Non renseigné</span>;
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (value === 'yes') return 'Oui';
    if (value === 'no') return 'Non';
    return <span className="font-medium text-foreground">{value}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Récapitulatif</h2>
        <p className="text-muted-foreground mt-1">
          Veuillez vérifier vos informations avant de soumettre définitivement votre dossier.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Civilité :</span> {renderFieldValue(data.step1?.civility)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Nom :</span> {renderFieldValue(data.step1?.lastName)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Prénom :</span> {renderFieldValue(data.step1?.firstName)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Date de naissance :</span> {renderFieldValue(data.step1?.dateOfBirth)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Nationalité :</span> {renderFieldValue(data.step1?.nationality)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Téléphone :</span> {renderFieldValue(data.step1?.phone)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Email :</span> {renderFieldValue(data.step1?.email)}</div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Pièce d'Identité
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Type :</span> <span className="uppercase">{renderFieldValue(data.step2?.idType)}</span></div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Numéro :</span> {renderFieldValue(data.step2?.idNumber)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Date d'émission :</span> {renderFieldValue(data.step2?.idIssueDate)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Expiration :</span> {renderFieldValue(data.step2?.idExpiryDate)}</div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Profession
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Profession :</span> {renderFieldValue(data.step3?.profession)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Employeur :</span> {renderFieldValue(data.step3?.employer)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Ancienneté :</span> {renderFieldValue(data.step3?.employedSince)}</div>
          </CardContent>
        </Card>

        {/* Step 4 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Services
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Compte Particulier :</span> {renderFieldValue(data.step4?.openIndividualAccount)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Chéquier :</span> {renderFieldValue(data.step4?.requestCheckbook)}</div>
            {data.step4?.requestCheckbook === 'yes' && (
              <>
                <div className="grid grid-cols-2 pl-4 border-l-2 ml-1"><span className="text-muted-foreground">Nombre :</span> {renderFieldValue(data.step4?.numberOfCheckbooks)}</div>
                <div className="grid grid-cols-2 pl-4 border-l-2 ml-1"><span className="text-muted-foreground">Type :</span> {renderFieldValue(data.step4?.checkbookType)}</div>
              </>
            )}
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Carte Bancaire :</span> {renderFieldValue(data.step4?.requestCard)}</div>
            {data.step4?.requestCard === 'yes' && (
              <div className="grid grid-cols-2 pl-4 border-l-2 ml-1"><span className="text-muted-foreground">Type de carte :</span> <span className="capitalize">{renderFieldValue(data.step4?.cardType)}</span></div>
            )}
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Orange Money :</span> {renderFieldValue(data.step4?.activateOrangeMoney)}</div>
          </CardContent>
        </Card>

        {/* Step 5 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" /> Banque
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Agence :</span> {renderFieldValue(data.step5?.agencyName)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Code Guichet :</span> {renderFieldValue(data.step5?.branchCode)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">N° Compte :</span> {renderFieldValue(data.step5?.accountNumber)}</div>
            <div className="grid grid-cols-2"><span className="text-muted-foreground">Clé RIB :</span> {renderFieldValue(data.step5?.ribKey)}</div>
          </CardContent>
        </Card>

        {/* Step 6 */}
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" /> Biométrie
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-md">
              <CheckCircle2 size={18} />
              <span className="font-medium">Identité vérifiée avec succès</span>
            </div>
            {data.step6?.idFrontImage && (
              <div className="mt-3">
                <span className="text-muted-foreground text-xs block mb-1">Pièce scannée :</span>
                <img src={data.step6.idFrontImage} alt="ID" className="h-16 rounded border shadow-sm" />
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
