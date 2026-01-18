import { CreditCard, Smartphone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ProductsData, type IdDocumentType } from '@/types/onboarding';

interface ProductsStepProps {
  data: ProductsData;
  onChange: (data: ProductsData) => void;
}

const ProductsStep = ({ data, onChange }: ProductsStepProps) => {

  const handleWaveChange = (field: keyof NonNullable<ProductsData['waveDetails']>, value: string) => {
    onChange({
      ...data,
      waveDetails: {
        ...(data.waveDetails || { idType: 'cni', idCountry: 'SN', idNumber: '', activationCode: '' }),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Produits & Services</h2>

      {/* CARTE */}
      <div className="form-section">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-medium text-lg">Contrat Carte Bancaire</h3>
        </div>

        <RadioGroup
          value={data.cardType}
          onValueChange={(v) => onChange({ ...data, cardType: v as any })}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {['azur', 'elite', 'platine'].map((type) => (
            <div key={type} className={`relative flex flex-col items-center justify-between border-2 rounded-xl p-4 cursor-pointer hover:bg-accent/50 ${data.cardType === type ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <RadioGroupItem value={type} id={type} className="absolute top-4 right-4" />
              <Label htmlFor={type} className="flex flex-col items-center gap-2 cursor-pointer w-full h-full">
                <span className="font-bold uppercase tracking-widest text-lg">{type}</span>
                <span className="text-xs text-muted-foreground text-center">Carte {type === 'platine' ? 'PRESTIGE' : type === 'elite' ? 'PREMIUM' : 'STANDARD'}</span>
              </Label>
            </div>
          ))}
          <div className={`relative flex items-center justify-center border-2 rounded-xl p-4 cursor-pointer border-dashed ${data.cardType === 'none' ? 'border-primary' : 'border-border'}`}>
            <RadioGroupItem value="none" id="none" className="mr-2" />
            <Label htmlFor="none" className="cursor-pointer">Pas de carte</Label>
          </div>
        </RadioGroup>

        {data.cardType !== 'none' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <div className="space-y-2">
              <Label>Code Guichet</Label>
              <Input value={data.branchCode} onChange={(e) => onChange({ ...data, branchCode: e.target.value })} placeholder="00000" />
            </div>
            <div className="space-y-2">
              <Label>Numéro de Compte</Label>
              <Input value={data.accountNumber || ''} onChange={(e) => onChange({ ...data, accountNumber: e.target.value })} placeholder="123456789012" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Raison Sociale</Label>
              <Input value={data.companyName || ''} onChange={(e) => onChange({ ...data, companyName: e.target.value })} placeholder="Nom de la société (Si applicable)" />
            </div>
          </div>
        )}
      </div>

      {/* WAVE */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-lg">Contrat Wave (B2W)</h3>
          </div>
          <Switch checked={data.hasWave} onCheckedChange={(c) => onChange({ ...data, hasWave: c })} />
        </div>

        {data.hasWave && (
          <div className="space-y-4 pt-4 border-t animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type de ID Wave</Label>
                <Select value={data.waveDetails?.idType} onValueChange={(v) => handleWaveChange('idType', v as IdDocumentType)}>
                  <SelectTrigger> <SelectValue /> </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cni">CNI</SelectItem>
                    <SelectItem value="passport">Passeport</SelectItem>
                    <SelectItem value="consular">Carte Consulaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pays ID</Label>
                <Input value={data.waveDetails?.idCountry} onChange={(e) => handleWaveChange('idCountry', e.target.value)} placeholder="SN" />
              </div>
              <div className="space-y-2">
                <Label>Numéro ID Wave</Label>
                <Input value={data.waveDetails?.idNumber} onChange={(e) => handleWaveChange('idNumber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Code d'Activation</Label>
                <Input value={data.waveDetails?.activationCode} onChange={(e) => handleWaveChange('activationCode', e.target.value)} placeholder="Reçu par SMS" />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductsStep;
