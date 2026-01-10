import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { MONTHLY_VOLUMES, type RegulatoryData } from '@/types/onboarding';

interface RegulatoryStepProps {
  data: RegulatoryData;
  onChange: (data: RegulatoryData) => void;
}

const RegulatoryStep = ({ data, onChange }: RegulatoryStepProps) => {
  const { t } = useLanguage();

  const handleChange = <K extends keyof RegulatoryData>(field: K, value: RegulatoryData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t('step.regulatory')}</h2>

      {/* FATCA Section */}
      <div className="form-section">
        <h3 className="font-medium text-lg mb-4">{t('regulatory.fatca.title')}</h3>
        
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
          <Label htmlFor="usPerson" className="cursor-pointer">
            {t('regulatory.fatca.usPerson')}
          </Label>
          <Switch
            id="usPerson"
            checked={data.isUsPerson}
            onCheckedChange={(checked) => handleChange('isUsPerson', checked)}
          />
        </div>

        {data.isUsPerson && (
          <div className="mt-4 space-y-2 animate-fade-in">
            <Label>Détails supplémentaires</Label>
            <Textarea
              value={data.usPersonDetails || ''}
              onChange={(e) => handleChange('usPersonDetails', e.target.value)}
              placeholder="Numéro de sécurité sociale américain, etc."
            />
          </div>
        )}
      </div>

      {/* Source of Funds */}
      <div className="form-section">
        <div className="space-y-2">
          <Label>{t('regulatory.sourceOfFunds')}</Label>
          <Select value={data.sourceOfFunds} onValueChange={(v) => handleChange('sourceOfFunds', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salary">{t('regulatory.sourceOfFunds.salary')}</SelectItem>
              <SelectItem value="business">{t('regulatory.sourceOfFunds.business')}</SelectItem>
              <SelectItem value="inheritance">{t('regulatory.sourceOfFunds.inheritance')}</SelectItem>
              <SelectItem value="savings">{t('regulatory.sourceOfFunds.savings')}</SelectItem>
              <SelectItem value="other">{t('regulatory.sourceOfFunds.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {data.sourceOfFunds === 'other' && (
          <div className="mt-4 space-y-2 animate-fade-in">
            <Label>Précisez</Label>
            <Textarea
              value={data.sourceOfFundsDetails || ''}
              onChange={(e) => handleChange('sourceOfFundsDetails', e.target.value)}
              placeholder="Décrivez la source de vos fonds..."
            />
          </div>
        )}
      </div>

      {/* Monthly Volume */}
      <div className="form-section">
        <div className="space-y-2">
          <Label>{t('regulatory.monthlyVolume')}</Label>
          <Select value={data.expectedMonthlyVolume} onValueChange={(v) => handleChange('expectedMonthlyVolume', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {MONTHLY_VOLUMES.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Occupation */}
      <div className="form-section">
        <div className="space-y-2">
          <Label htmlFor="occupation">{t('regulatory.occupation')}</Label>
          <Input
            id="occupation"
            value={data.occupation}
            onChange={(e) => handleChange('occupation', e.target.value)}
            placeholder="Ingénieur / SONATEL"
          />
        </div>
      </div>

      {/* PEP */}
      <div className="form-section">
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
          <Label htmlFor="pep" className="cursor-pointer">
            {t('regulatory.pep')}
          </Label>
          <Switch
            id="pep"
            checked={data.isPep}
            onCheckedChange={(checked) => handleChange('isPep', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default RegulatoryStep;
