import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BRANCHES, type BankingData } from '@/types/onboarding';

interface BankingStepProps {
  data: BankingData;
  onChange: (data: BankingData) => void;
}

const BankingStep = ({ data, onChange }: BankingStepProps) => {

  const handleChange = (field: keyof BankingData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Informations Compte & Bancaires</h2>

      {/* Account Type Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-muted p-1 rounded-lg flex gap-1">
          <button
            onClick={() => handleChange('accountInfoType', 'individual')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${data.accountInfoType === 'individual' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Compte Particulier
          </button>
          <button
            onClick={() => handleChange('accountInfoType', 'corporate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${data.accountInfoType === 'corporate' ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Compte Société
          </button>
        </div>
      </div>

      {/* INDIVIDUAL FORM */}
      {data.accountInfoType === 'individual' && (
        <div className="form-section animate-slide-up">
          <h3 className="font-medium text-lg mb-4 text-primary">Détails Particulier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Profession/Fonction</Label>
              <Input value={data.profession} onChange={(e) => handleChange('profession', e.target.value)} placeholder="Ex: Commerçant" />
            </div>
            <div className="space-y-2">
              <Label>Adresse Postale</Label>
              <Input value={data.postalAddress} onChange={(e) => handleChange('postalAddress', e.target.value)} placeholder="Ex: 123 Main St, Dakar" />
            </div>
            <div className="space-y-2">
              <Label>Employeur</Label>
              <Input value={data.employer} onChange={(e) => handleChange('employer', e.target.value)} placeholder="Ex: Commerçant" />
            </div>
            <div className="space-y-2">
              <Label>Employé depuis le</Label>
              <Input type="date" value={data.employedSince} onChange={(e) => handleChange('employedSince', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Date et Lieu d'émission ID</Label>
              <Input value={data.idIssueDetails} onChange={(e) => handleChange('idIssueDetails', e.target.value)} placeholder="Ex: Dakar le 01/01/2020" />
            </div>
          </div>
        </div>
      )}

      {/* CORPORATE FORM */}
      {data.accountInfoType === 'corporate' && (
        <div className="form-section animate-slide-up">
          <h3 className="font-medium text-lg mb-4 text-primary">Détails Société</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Raison Sociale (Nom Société)</Label>
              <Input value={data.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Forme Juridique</Label>
              <Input value={data.legalForm} onChange={(e) => handleChange('legalForm', e.target.value)} placeholder="SA, SARL, SUARL..." />
            </div>
            <div className="space-y-2">
              <Label>Siège Social</Label>
              <Input value={data.headquarters} onChange={(e) => handleChange('headquarters', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Adresse Courrier</Label>
              <Input value={data.mailingAddress} onChange={(e) => handleChange('mailingAddress', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Introduit par</Label>
              <Input value={data.introducedBy} onChange={(e) => handleChange('introducedBy', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Références Bancaires</Label>
              <Input value={data.bankingReferences} onChange={(e) => handleChange('bankingReferences', e.target.value)} />
            </div>
          </div>

          <div className="mt-4 space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Compte Principal ?</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={data.isMainAccount} onChange={() => handleChange('isMainAccount', true)} /> Oui
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" checked={!data.isMainAccount} onChange={() => handleChange('isMainAccount', false)} /> Non
                </label>
              </div>
            </div>
            {!data.isMainAccount && (
              <div className="space-y-2 animate-slide-up">
                <Label>Numéro Compte Principal</Label>
                <Input value={data.mainAccountNumber} onChange={(e) => handleChange('mainAccountNumber', e.target.value)} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch checked={data.hasRelatedAccounts} onCheckedChange={(c) => handleChange('hasRelatedAccounts', c)} />
              <Label>Compte en relation avec d'autres comptes ?</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={data.mergeInterests} onCheckedChange={(c) => handleChange('mergeInterests', c)} />
              <Label>Comptabiliser intérêts/frais dans compte principal ?</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={data.keepExtracts} onCheckedChange={(c) => handleChange('keepExtracts', c)} />
              <Label>Garder les extraits en agence ?</Label>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <Label className="mb-2 block font-semibold">Documents à remettre (Cocher si reçu)</Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['delegation', 'statuts', 'pouvoirs', 'rccm', 'specimen'].map(docKey => (
                <label key={docKey} className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={data.submittedDocs?.[docKey as keyof typeof data.submittedDocs] as boolean}
                    onChange={(e) => handleChange('submittedDocs', { ...data.submittedDocs, [docKey]: e.target.checked })}
                  />
                  <span className="capitalize">{docKey}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <Input
                placeholder="Autres documents..."
                value={data.submittedDocs?.autres || ''}
                onChange={(e) => handleChange('submittedDocs', { ...data.submittedDocs, autres: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* COMMON FIELDS */}
      <div className="form-section">
        <h3 className="font-medium text-lg mb-4 text-primary">Informations Générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Agence de domiciliation</Label>
            <Select value={data.agency} onValueChange={(v) => handleChange('agency', v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {BRANCHES.map((branch) => (
                  <SelectItem key={branch.value} value={branch.value}>{branch.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dépôt Initial (FCFA)</Label>
            <Input
              type="number"
              value={data.initialDeposit}
              onChange={(e) => handleChange('initialDeposit', e.target.value)}
              placeholder="Ex: 50000"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base">Boîte Postale</Label>
                <p className="text-xs text-muted-foreground">Voulez-vous qu'une boîte à lettre vous soit attribuée chez nous ?</p>
              </div>
              <Switch
                checked={data.hasMailbox}
                onCheckedChange={(checked) => handleChange('hasMailbox', checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BANK RESERVE SECTION */}
      <div className="form-section bg-secondary/20 border-l-4 border-l-primary/50">
        <h3 className="font-medium text-lg mb-4 text-primary/80 uppercase tracking-wide flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          Réservé à la Banque
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center gap-2 p-3 bg-background rounded border cursor-pointer hover:border-primary">
            <input type="checkbox" checked={data.checkbookAuthorized} onChange={(e) => handleChange('checkbookAuthorized', e.target.checked)} className="h-4 w-4" />
            <span className="font-medium">Carnet de chèque autorisé</span>
          </label>
          <label className="flex items-center gap-2 p-3 bg-background rounded border cursor-pointer hover:border-primary">
            <input type="checkbox" checked={data.orderBookAuthorized} onChange={(e) => handleChange('orderBookAuthorized', e.target.checked)} className="h-4 w-4" />
            <span className="font-medium">Carnet d'ordre de paiement autorisé</span>
          </label>
          <label className="flex items-center gap-2 p-3 bg-background rounded border cursor-pointer hover:border-primary">
            <input type="checkbox" checked={data.waitForInfo} onChange={(e) => handleChange('waitForInfo', e.target.checked)} className="h-4 w-4" />
            <span className="font-medium">Attendre les renseignements</span>
          </label>
          <label className="flex items-center gap-2 p-3 bg-background rounded border cursor-pointer hover:border-primary">
            <input type="checkbox" checked={data.waitForFunds} onChange={(e) => handleChange('waitForFunds', e.target.checked)} className="h-4 w-4" />
            <span className="font-medium">Attendre les fonds</span>
          </label>
        </div>

        <div className="space-y-2">
          <Label>Remarques (Instruction spéciale)</Label>
          <textarea
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
            placeholder="Ecrire ici..."
            value={data.bankComments}
            onChange={(e) => handleChange('bankComments', e.target.value)}
          />
        </div>
      </div>

    </div>
  );
};

export default BankingStep;
