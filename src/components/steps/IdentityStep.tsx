import { Upload, Camera, Scan, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { NATIONALITIES, DEMO_DATA, type IdentityData } from '@/types/onboarding';

interface IdentityStepProps {
  data: IdentityData;
  onChange: (data: IdentityData) => void;
  onScanId: () => void;
}

const IdentityStep = ({ data, onChange, onScanId }: IdentityStepProps) => {
  const { t, language } = useLanguage();

  const handleChange = (field: keyof IdentityData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('step.identity')}</h2>
        <Button variant="outline" onClick={onScanId} className="gap-2">
          <Scan className="h-4 w-4" />
          {t('identity.scanId')}
        </Button>
      </div>

      <div className="form-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">{t('identity.firstName')}</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Amadou"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">{t('identity.lastName')}</Label>
            <Input
              id="lastName"
              value={data.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Diallo"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">{t('identity.dob')}</Label>
            <Input
              id="dob"
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pob">{t('identity.pob')}</Label>
            <Input
              id="pob"
              value={data.placeOfBirth}
              onChange={(e) => handleChange('placeOfBirth', e.target.value)}
              placeholder="Dakar"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">{t('identity.nationality')}</Label>
          <Select value={data.nationality} onValueChange={(v) => handleChange('nationality', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {language === 'fr' ? n.label : n.labelEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t('identity.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+221 77 123 45 67"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('identity.address')}</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="12 Rue Félix Faure, Dakar Plateau"
          />
        </div>
      </div>

      <div className="form-section">
        <h3 className="font-medium mb-4">{t('identity.idUpload')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="upload-zone">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Recto</p>
            <input type="file" accept="image/*" className="hidden" />
          </div>
          <div className="upload-zone">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Verso</p>
            <input type="file" accept="image/*" className="hidden" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="font-medium mb-4">{t('identity.selfie')}</h3>
        <div className="upload-zone">
          <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Cliquez pour prendre un selfie</p>
        </div>
      </div>
    </div>
  );
};

export default IdentityStep;
