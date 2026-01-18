import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MONTHLY_VOLUMES, type ComplianceData } from '@/types/onboarding';

interface RegulatoryStepProps {
  data: ComplianceData;
  onChange: (data: ComplianceData) => void;
}

const RegulatoryStep = ({ data, onChange }: RegulatoryStepProps) => {

  const handleChange = <K extends keyof ComplianceData>(field: K, value: ComplianceData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Conformité (BIC & FATCA)</h2>

      {/* FATCA */}
      <div className="form-section">
        <h3 className="font-medium text-lg mb-4 text-primary">Formulaire FATCA & Résidence Fiscale</h3>

        <div className="space-y-6">
          {/* US Person */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
            <Label htmlFor="usPerson" className="cursor-pointer font-medium">
              Êtes-vous une "US Person" ? (Citoyen ou Résident Fiscal USA)
            </Label>
            <Switch
              id="usPerson"
              checked={data.isUsPerson}
              onCheckedChange={(checked) => handleChange('isUsPerson', checked)}
            />
          </div>

          {/* Tax Residence Mode */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="font-semibold block mb-2">RÉSIDENCE FISCALE (COCHER OBLIGATOIREMENT UNE DES DEUX CASES)</Label>

            <div className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 ${data.isExclusiveTaxResidentSenegal ? 'border-primary bg-primary/5' : ''}`} onClick={() => handleChange('isExclusiveTaxResidentSenegal', true)}>
              <div className={`mt-1 h-4 w-4 rounded-full border border-primary flex items-center justify-center ${data.isExclusiveTaxResidentSenegal ? 'bg-primary' : ''}`}>
                {data.isExclusiveTaxResidentSenegal && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="space-y-1">
                <span className="font-medium">1. Je déclare être exclusivement résident fiscal au Sénégal</span>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 ${!data.isExclusiveTaxResidentSenegal ? 'border-primary bg-primary/5' : ''}`} onClick={() => handleChange('isExclusiveTaxResidentSenegal', false)}>
              <div className={`mt-1 h-4 w-4 rounded-full border border-primary flex items-center justify-center ${!data.isExclusiveTaxResidentSenegal ? 'bg-primary' : ''}`}>
                {!data.isExclusiveTaxResidentSenegal && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="space-y-1">
                <span className="font-medium">2. Je déclare être imposable dans plusieurs pays et/ou hors du Sénégal uniquement.</span>
                <p className="text-sm text-muted-foreground">Dans cette situation, je complète le tableau ci-dessous (sans oublier le Sénégal le cas échéant).</p>
              </div>
            </div>

            {/* Dynamic Tax Residences Table */}
            {!data.isExclusiveTaxResidentSenegal && (
              <div className="space-y-3 pl-4 animate-slide-up">
                {(data.taxResidences || []).map((res, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-muted/30 rounded-md relative group">
                    <div className="space-y-1">
                      <Label className="text-xs">Pays de résidence fiscale</Label>
                      <Input
                        value={res.country}
                        onChange={(e) => {
                          const newRes = [...data.taxResidences];
                          newRes[index].country = e.target.value;
                          handleChange('taxResidences', newRes);
                        }}
                        placeholder="Pays"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">NIF (Numéro d'Identification Fiscale)</Label>
                      <Input
                        value={res.nif}
                        onChange={(e) => {
                          const newRes = [...data.taxResidences];
                          newRes[index].nif = e.target.value;
                          handleChange('taxResidences', newRes);
                        }}
                        placeholder="Indiquer N/A si inexistant"
                      />
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => {
                        const newRes = data.taxResidences.filter((_, i) => i !== index);
                        handleChange('taxResidences', newRes);
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleChange('taxResidences', [...(data.taxResidences || []), { country: '', nif: '' }])}
                  className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  + Ajouter un pays de résidence fiscale
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BIC / AML */}
      <div className="form-section">
        <h3 className="font-medium text-lg mb-4 text-primary">Informations Réglementaires (BIC/AML)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label>Numéro de Compte (BIC)</Label>
            <Input value={data.bicAccountNumber} onChange={(e) => handleChange('bicAccountNumber', e.target.value)} placeholder="Pour déclaration BIC" />
          </div>
          <div className="space-y-2">
            <Label>Provenance des fonds</Label>
            <Select value={data.sourceOfFunds} onValueChange={(v) => handleChange('sourceOfFunds', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salaire</SelectItem>
                <SelectItem value="business">Affaires / Commerce</SelectItem>
                <SelectItem value="inheritance">Succession</SelectItem>
                <SelectItem value="savings">Épargne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Volume Mensuel Attendu</Label>
            <Select value={data.monthlyVolume} onValueChange={(v) => handleChange('monthlyVolume', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {MONTHLY_VOLUMES.map(v => <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between p-4 bg-background rounded-lg border md:col-span-2">
            <Label htmlFor="pep" className="cursor-pointer font-medium">
              Êtes-vous une Personne Politiquement Exposée (PPE) ?
            </Label>
            <Switch
              id="pep"
              checked={data.isPep}
              onCheckedChange={(checked) => handleChange('isPep', checked)}
            />
          </div>
        </div>

        {/* Legal Consent Checkboxes (BIC) */}
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border text-sm">
          <h4 className="font-semibold text-primary">Consentement BIC (Crédit Bureau)</h4>
          <div className="flex items-start gap-3">
            <input type="checkbox" id="bic1" checked={data.creditInfoConsent} onChange={(e) => handleChange('creditInfoConsent', e.target.checked)} className="mt-1" />
            <Label htmlFor="bic1" className="cursor-pointer font-normal leading-relaxed">
              J'accepte que les informations de crédit, historiques et courantes, me concernant notamment, les soldes approuvés et en souffrance, les limites de crédit, les cessations de paiement, le solde des arriérés auprès de la banque soient transmises à [CREDIT INFO VOLO]. [Art 41 points 2, 3 et 4 , Art 44, points 1 et 2]
            </Label>
          </div>
          <p className="text-muted-foreground text-xs italic pl-6">
            En cochant cette case, vous confirmez avoir lu, compris et accepté l'ensemble des dispositions légales relatives au partage d'informations avec le Bureau d'Information sur le Crédit (BIC), incluant :
            <br />- La communication des données aux établissements autorisés (Art 42, 44).
            <br />- L'exclusion des données sur vos dépôts (Art 53).
            <br />- La durée de conservation des données (5 ans + 5 ans) (Art 41).
            <br />- Vos droits d'accès, de rectification et d'obtention de rapport gratuit. (Art 44).
          </p>
        </div>
      </div>

    </div>
  );
};

export default RegulatoryStep;
