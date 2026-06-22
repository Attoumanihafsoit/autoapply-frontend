import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AGENCIES } from '@/types/onboarding';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';

export const Step5Banking = () => {
  const { control, setValue } = useFormContext<OnboardingFormValues>();

  const handleAgencyChange = (value: string) => {
    setValue('step5.agencyName', value, { shouldValidate: true });
    const agency = AGENCIES.find(a => a.value === value);
    if (agency) {
      setValue('step5.branchCode', agency.code, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Informations bancaires</h2>
        <p className="text-muted-foreground mt-1">
          Renseignez vos identifiants bancaires BIMAO.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="step5.agencyName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nom de l'agence *</FormLabel>
              <Select onValueChange={handleAgencyChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Sélectionnez une agence" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AGENCIES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
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
          name="step5.branchCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code guichet *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="0000"
                  maxLength={4}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>Auto-rempli si l'agence est connue (4 chiffres)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step5.accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de compte BIMAO *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="01234567890"
                  maxLength={11}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>11 chiffres requis</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step5.ribKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clé RIB *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="00"
                  maxLength={2}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>2 chiffres</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step5.bankReferences"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Références bancaires (Optionnel)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Autres comptes ou références..."
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
