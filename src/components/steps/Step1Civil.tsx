import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, Upload, Camera, Loader2 } from 'lucide-react';
import { ocrService } from '@/services/ocrService';
import { toast } from 'sonner';
import { NATIONALITIES } from '@/types/onboarding';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';

export const Step1Civil = () => {
  const { control, setValue } = useFormContext<OnboardingFormValues>();
  const { language } = useLanguage();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleOptionSelect = (option: 'upload' | 'camera') => {
    setIsDialogOpen(false);
    if (option === 'upload') {
      fileInputRef.current?.click();
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      // Store the image locally for Step 6 immediately
      const imageUrl = URL.createObjectURL(file);
      setValue('step6.idFrontImage', imageUrl, { shouldValidate: false });

      // Call OCR service
      const result = await ocrService.uploadDocument('temp-id', file, 'ID_FRONT');

      if (result.data) {
        // Auto-fill Step 1 fields
        if (result.data.firstName) setValue('step1.firstName', result.data.firstName, { shouldValidate: true });
        if (result.data.lastName) setValue('step1.lastName', result.data.lastName, { shouldValidate: true });
        if (result.data.dateOfBirth) setValue('step1.dateOfBirth', result.data.dateOfBirth, { shouldValidate: true });
        if (result.data.placeOfBirth) setValue('step1.placeOfBirth', result.data.placeOfBirth, { shouldValidate: true });
        if (result.data.nationality) setValue('step1.nationality', result.data.nationality, { shouldValidate: true });
        if (result.data.address) setValue('step1.address', result.data.address, { shouldValidate: true });

        // Auto-fill Step 2 fields
        if (result.data.idNumber) setValue('step2.idNumber', result.data.idNumber, { shouldValidate: true });
        if (result.data.idIssueDate) setValue('step2.idIssueDate', result.data.idIssueDate, { shouldValidate: true });
        if (result.data.idExpiryDate) setValue('step2.idExpiryDate', result.data.idExpiryDate, { shouldValidate: true });
        if (result.data.idIssuePlace) setValue('step2.idIssuePlace', result.data.idIssuePlace, { shouldValidate: true });
        if (result.data.idType) setValue('step2.idType', result.data.idType as any, { shouldValidate: true });

        toast.success("Informations extraites à 100% avec succès !");
      }
    } catch (error) {
      toast.error("Erreur lors de l'analyse du document");
      console.error(error);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

      {/* Scan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scanner une pièce d'identité</DialogTitle>
            <DialogDescription>
              Uploadez ou prenez en photo votre pièce d'identité. Les champs de l'étape 1 et 2 seront auto-remplis, et l'image sera sauvegardée.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary" onClick={() => handleOptionSelect('upload')}>
              <Upload className="h-8 w-8 text-primary" />
              <span>Importer un fichier</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary" onClick={() => handleOptionSelect('camera')}>
              <Camera className="h-8 w-8 text-primary" />
              <span>Prendre une photo</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            Identification civile & coordonnées
          </h2>
          <p className="text-muted-foreground mt-1">Veuillez renseigner vos informations personnelles.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsDialogOpen(true)} 
          disabled={isScanning}
          className="gap-2 shrink-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
        >
          {isScanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <QrCode className="h-5 w-5" />}
          {isScanning ? 'Analyse en cours...' : 'Scanner pour Auto-remplir'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="step1.civility"
          render={({ field }) => (
            <FormItem className="space-y-3 md:col-span-2">
              <FormLabel>Civilité *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="M." />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">M.</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Mme" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Mme</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Mlle" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">Mlle</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de famille *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="DIOP"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  className="uppercase transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Moussa"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.placeOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu de naissance *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Dakar"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationalité *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Sélectionnez un pays" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITIES.map((n) => (
                    <SelectItem key={n.value} value={n.value}>
                      {language === 'fr' ? n.label : n.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  {...field}
                  placeholder="77XXXXXXX"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  placeholder="exemple@email.com"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Adresse de domicile *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Votre adresse complète..."
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step1.postalAddress"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Adresse postale / BP (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="BP 12345 Dakar"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
