import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';
import { CheckCircle2, XCircle, ScanFace, FileBox, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Step6Biometric = () => {
  const { control, setValue, watch } = useFormContext<OnboardingFormValues>();
  const [isVerifying, setIsVerifying] = useState(false);
  
  const livenessPassed = watch('step6.livenessPassed');
  const faceMatchPassed = watch('step6.faceMatchPassed');
  const idFrontImage = watch('step6.idFrontImage');

  const simulateDojahVerification = async (success: boolean) => {
    setIsVerifying(true);
    // Simulate SDK delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (success) {
      setValue('step6.livenessPassed', true, { shouldValidate: true });
      setValue('step6.faceMatchPassed', true, { shouldValidate: true });
      toast.success("Vérification biométrique réussie ! (Liveness: 92%, Face Match: 88%)");
      
      // Auto-fill some step 2 info if they were empty (mock OCR)
      setValue('step2.idNumber', 'SN123456789', { shouldValidate: false });
      setValue('step2.idIssueDate', '2022-01-01', { shouldValidate: false });
      setValue('step2.idExpiryDate', '2032-01-01', { shouldValidate: false });
      setValue('step2.idIssuePlace', 'Dakar', { shouldValidate: false });
      toast.info("Les informations de votre pièce ont été extraites.");
    } else {
      setValue('step6.livenessPassed', false, { shouldValidate: true });
      setValue('step6.faceMatchPassed', false, { shouldValidate: true });
      toast.error("Vérification échouée. Veuillez réessayer.");
    }
    
    setIsVerifying(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Vérification biométrique</h2>
        <p className="text-muted-foreground mt-1">
          Dernière étape ! Nous devons vérifier votre identité via l'intégration sécurisée Dojah.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ID Document Capture */}
        <div className="p-6 border rounded-xl bg-card flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
          {idFrontImage ? (
            <div className="w-24 h-16 rounded-md overflow-hidden border border-primary/20 shadow-sm relative">
              <img src={idFrontImage} alt="ID Front" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="text-green-600 drop-shadow-md" size={24} />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <FileBox size={32} />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">Pièce d'Identité</h3>
            <p className="text-sm text-muted-foreground mt-1">Capturez le recto et verso de votre pièce.</p>
          </div>
        </div>

        {/* Liveness & Selfie */}
        <div className="p-6 border rounded-xl bg-card flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
            <ScanFace size={32} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Selfie & Liveness</h3>
            <p className="text-sm text-muted-foreground mt-1">Détection de vie et correspondance faciale.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center py-8 border-t space-y-6">
        
        {livenessPassed && faceMatchPassed ? (
          <div className="flex items-center space-x-3 text-green-600 bg-green-50 dark:bg-green-900/20 px-6 py-4 rounded-xl border border-green-200 dark:border-green-800 animate-in zoom-in">
            <CheckCircle2 size={24} />
            <div className="font-medium">
              <p>Vérification validée avec succès</p>
              <p className="text-sm opacity-80">Liveness &gt; 80, Face Match &gt; 75</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => simulateDojahVerification(true)}
              disabled={isVerifying}
              className="w-full sm:w-auto"
            >
              {isVerifying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanFace className="mr-2 h-5 w-5" />}
              Lancer SDK Dojah (Succès)
            </Button>
            <Button 
              variant="destructive" 
              size="lg" 
              onClick={() => simulateDojahVerification(false)}
              disabled={isVerifying}
              className="w-full sm:w-auto"
            >
              Simuler Échec
            </Button>
          </div>
        )}

        {/* Hidden Form Fields for Validation */}
        <FormField
          control={control}
          name="step6.livenessPassed"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="checkbox" checked={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage className="block text-center mt-2" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="step6.faceMatchPassed"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="checkbox" checked={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage className="block text-center mt-2" />
            </FormItem>
          )}
        />

      </div>
    </div>
  );
};
