import { useState, useRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';
import { CheckCircle2, ScanFace, FileBox, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';

export const Step6Biometric = () => {
  const { control, setValue, watch } = useFormContext<OnboardingFormValues>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const livenessPassed = watch('step6.livenessPassed');
  const faceMatchPassed = watch('step6.faceMatchPassed');
  const idFrontImage = watch('step6.idFrontImage');
  const selfieImage = watch('step6.selfieImage');
  
  const idInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle ID Card Upload
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (file) {
    setValue('step6.idFrontImage', file, {
      shouldValidate: false
    });
  }
};

  // Start Camera
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      toast.error("Impossible d'accéder à la caméra.");
      setIsCameraOpen(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // Capture Photo
  const capturePhoto = () => {
  if (videoRef.current && canvasRef.current) {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File(
            [blob],
            "selfie.jpg",
            { type: "image/jpeg" }
          );

          setValue('step6.selfieImage', file, {
            shouldValidate: false
          });
        }
      }, "image/jpeg");

      stopCamera();
    }
  }
};

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const simulateBiometricVerification = async (success: boolean) => {
    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (success) {
      setValue('step6.livenessPassed', true, { shouldValidate: true });
      setValue('step6.faceMatchPassed', true, { shouldValidate: true });
      toast.success("Vérification biométrique réussie ! (Liveness: 92%, Face Match: 88%)");
      
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
          Dernière étape ! Nous devons vérifier votre identité de manière sécurisée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ID Document Capture */}
        <div 
          className="p-6 border rounded-xl bg-card flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={() => idInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={idInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleIdChange} 
          />
          {/* image */}
          { idFrontImage instanceof File ? (
  <div className="w-24 h-16 rounded-md overflow-hidden border border-primary/20 shadow-sm relative">
    <img
      src={URL.createObjectURL(idFrontImage)}
      alt="ID Front"
      className="w-full h-full object-cover"
    />

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
            <p className="text-sm text-muted-foreground mt-1">Cliquez pour importer le recto de votre CNI.</p>
          </div>
        </div>

        {/* Liveness & Selfie (Camera Modal) */}
        <div 
          className="p-6 border rounded-xl bg-card flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
          onClick={startCamera}
        >
          {selfieImage ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 shadow-sm relative">
              {/* <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" /> */}
   
{selfieImage instanceof File && (
  <img
    src={URL.createObjectURL(selfieImage)}
    alt="Selfie"
    className="w-full h-full object-cover"
  />
)}
                
              <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="text-green-600 drop-shadow-md opacity-80" size={24} />
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <ScanFace size={32} />
            </div>
          )}
          
          <div>
            <h3 className="font-semibold text-lg">Selfie & Liveness</h3>
            <p className="text-sm text-muted-foreground mt-1">Cliquez pour prendre une photo (caméra).</p>
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
              type="button"
              size="lg" 
              onClick={() => simulateBiometricVerification(true)}
              disabled={isVerifying || !idFrontImage || !selfieImage}
              className="w-full sm:w-auto"
            >
              {isVerifying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ScanFace className="mr-2 h-5 w-5" />}
              Lancer la vérification (Succès)
            </Button>
            <Button 
              type="button"
              variant="destructive" 
              size="lg" 
              onClick={() => simulateBiometricVerification(false)}
              disabled={isVerifying || !idFrontImage || !selfieImage}
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

      {/* Camera Modal */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Prendre un Selfie</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay Face Guide */}
              <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full m-8 pointer-events-none" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Placez votre visage dans l'ovale et cliquez sur capturer.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" size="lg" onClick={capturePhoto} className="gap-2 rounded-full px-8">
              <Camera className="h-5 w-5" />
              Capturer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
