import { useState, useRef } from 'react';
import { Upload, Camera, Scan, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { NATIONALITIES, type IdentityData } from '@/types/onboarding';
import { ocrService } from '@/services/ocrService';
import { toast } from 'sonner';

interface IdentityStepProps {
  data: IdentityData;
  onChange: (data: IdentityData) => void;
}

const IdentityStep = ({ data, onChange }: IdentityStepProps) => {
  const { t, language } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof IdentityData, value: string) => {
    onChange({ ...data, [field]: value });
  };

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
      const result = await ocrService.uploadDocument('temp-id', file, 'ID_FRONT');

      if (result.data) {
        onChange({
          ...data,
          firstName: result.data.firstName || data.firstName,
          lastName: result.data.lastName || data.lastName,
          idNumber: result.data.idNumber || data.idNumber,
          // Add more extracted fields if available in OCR result
        });
        toast.success("Informations extraites avec succès !");
      }
    } catch (error) {
      toast.error("Erreur lors de l'analyse");
      console.error(error);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />

      {/* Scan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scanner une pièce d'identité</DialogTitle>
            <DialogDescription>
              Les informations seront extraites automatiquement pour remplir le formulaire.
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

      {/* Scan Button Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Informations Personnelles (EER)</h2>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2" disabled={isScanning}>
          {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
          Scanner la pièce d'identité (Démo)
        </Button>
      </div>

      {/* IDENTIFICATION */}
      <div className="form-section">
        <h3 className="font-medium text-primary mb-4">Identification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('identity.firstName')}</Label>
            <Input id="firstName" value={data.firstName} onChange={(e) => handleChange('firstName', e.target.value)} placeholder="Amadou" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('identity.lastName')}</Label>
            <Input id="lastName" value={data.lastName} onChange={(e) => handleChange('lastName', e.target.value)} placeholder="Diallo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">{t('identity.dob')}</Label>
            <Input id="dob" type="date" value={data.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pob">{t('identity.pob')}</Label>
            <Input id="pob" value={data.placeOfBirth} onChange={(e) => handleChange('placeOfBirth', e.target.value)} placeholder="Dakar" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality">{t('identity.nationality')}</Label>
            <Select value={data.nationality} onValueChange={(v) => handleChange('nationality', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {NATIONALITIES.map((n) => (
                  <SelectItem key={n.value} value={n.value}>{language === 'fr' ? n.label : n.labelEn}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">{t('identity.address')}</Label>
            <Input id="address" value={data.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Adresse complète" />
          </div>
        </div>
      </div>

      {/* IDENTITE & PROFIL */}
      <div className="form-section">
        <h3 className="font-medium text-primary mb-4">Pièce d'Identité & Profil</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="occupation">Profession</Label>
            <Input id="occupation" value={data.occupation} onChange={(e) => handleChange('occupation', e.target.value)} placeholder="Ingénieur" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idNumber">Numéro CNI / Passeport</Label>
            <Input id="idNumber" value={data.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idIssueDate">Date de délivrance</Label>
            <Input id="idIssueDate" type="date" value={data.idIssueDate} onChange={(e) => handleChange('idIssueDate', e.target.value)} />
          </div>
        </div>
      </div>

      {/* FILIATION */}
      <div className="form-section">
        <h3 className="font-medium text-primary mb-4">Filiation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fatherFirstName">Prénom du Père</Label>
            <Input id="fatherFirstName" value={data.fatherFirstName} onChange={(e) => handleChange('fatherFirstName', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="motherFirstName">Prénom de la Mère</Label>
            <Input id="motherFirstName" value={data.motherFirstName} onChange={(e) => handleChange('motherFirstName', e.target.value)} />
          </div>

        </div>
      </div>

      {/* CONTACT & URGENCE */}
      <div className="form-section">
        <h3 className="font-medium text-primary mb-4">Contacts & Urgence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('identity.phone')}</Label>
            <Input id="phone" type="tel" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={data.email} onChange={(e) => handleChange('email', e.target.value)} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emergencyPhone">Contact Urgence (Tél)</Label>
            <Input id="emergencyPhone" type="tel" value={data.emergencyContactPhone} onChange={(e) => handleChange('emergencyContactPhone', e.target.value)} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default IdentityStep;
