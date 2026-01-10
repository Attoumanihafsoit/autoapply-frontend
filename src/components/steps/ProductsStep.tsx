import { CreditCard, Wallet, Building2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ProductsData, IdDocumentType } from '@/types/onboarding';

interface ProductsStepProps {
  data: ProductsData;
  onChange: (data: ProductsData) => void;
}

const ProductsStep = ({ data, onChange }: ProductsStepProps) => {
  const { t } = useLanguage();

  const toggleProduct = (field: 'currentAccount' | 'bankCard' | 'waveWallet') => {
    onChange({ ...data, [field]: !data[field] });
  };

  const handleWaveDetailChange = (field: keyof NonNullable<ProductsData['waveDetails']>, value: string) => {
    onChange({
      ...data,
      waveDetails: {
        idType: data.waveDetails?.idType || 'cni',
        idCountry: data.waveDetails?.idCountry || '',
        idNumber: data.waveDetails?.idNumber || '',
        [field]: value,
      },
    });
  };

  const products = [
    {
      key: 'currentAccount' as const,
      icon: Building2,
      selected: data.currentAccount,
    },
    {
      key: 'bankCard' as const,
      icon: CreditCard,
      selected: data.bankCard,
    },
    {
      key: 'waveWallet' as const,
      icon: Wallet,
      selected: data.waveWallet,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t('products.title')}</h2>

      <div className="grid gap-4">
        {products.map(({ key, icon: Icon, selected }) => (
          <div
            key={key}
            onClick={() => toggleProduct(key)}
            className={`card-feature cursor-pointer transition-all ${
              selected ? 'border-primary bg-accent/30 ring-2 ring-primary/20' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{t(`products.${key}`)}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                }`}
              >
                {selected && <Check className="h-4 w-4" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.waveWallet && (
        <div className="form-section animate-slide-up">
          <h3 className="font-medium mb-4">Informations B2W WAVE</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>{t('products.wave.idType')}</Label>
              <Select
                value={data.waveDetails?.idType || 'cni'}
                onValueChange={(v) => handleWaveDetailChange('idType', v as IdDocumentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cni">{t('products.wave.idType.cni')}</SelectItem>
                  <SelectItem value="passport">{t('products.wave.idType.passport')}</SelectItem>
                  <SelectItem value="consular">{t('products.wave.idType.consular')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idCountry">{t('products.wave.idCountry')}</Label>
              <Input
                id="idCountry"
                value={data.waveDetails?.idCountry || ''}
                onChange={(e) => handleWaveDetailChange('idCountry', e.target.value)}
                placeholder="Sénégal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">{t('products.wave.idNumber')}</Label>
              <Input
                id="idNumber"
                value={data.waveDetails?.idNumber || ''}
                onChange={(e) => handleWaveDetailChange('idNumber', e.target.value)}
                placeholder="1234567890123"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsStep;
