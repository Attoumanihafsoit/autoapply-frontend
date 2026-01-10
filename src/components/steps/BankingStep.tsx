import { HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { BRANCHES, type BankingData } from '@/types/onboarding';

interface BankingStepProps {
  data: BankingData;
  onChange: (data: BankingData) => void;
}

const BankingStep = ({ data, onChange }: BankingStepProps) => {
  const { t } = useLanguage();

  const handleChange = (field: keyof BankingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-xl font-semibold">{t('step.banking')}</h2>

      <div className="form-section">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">{t('banking.accountNumber')}</Label>
          <Input
            id="accountNumber"
            value={data.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="SN012345678901"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">{t('banking.branch')}</Label>
          <Select value={data.branch} onValueChange={(v) => handleChange('branch', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une agence..." />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('banking.channel')}</Label>
          <Select
            value={data.preferredChannel}
            onValueChange={(v) => handleChange('preferredChannel', v as BankingData['preferredChannel'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-branch">{t('banking.channel.inBranch')}</SelectItem>
              <SelectItem value="online">{t('banking.channel.online')}</SelectItem>
              <SelectItem value="hybrid">{t('banking.channel.hybrid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="activationCode">{t('banking.activationCode')}</Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{t('banking.activationTooltip')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="activationCode"
            value={data.activationCode}
            onChange={(e) => handleChange('activationCode', e.target.value)}
            placeholder="ACT-2024-001"
          />
        </div>
      </div>
    </div>
  );
};

export default BankingStep;
