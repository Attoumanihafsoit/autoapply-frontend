import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';

export const Step3Profession = () => {
  const { control } = useFormContext<OnboardingFormValues>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Situation professionnelle</h2>
        <p className="text-muted-foreground mt-1">
          Parlez-nous de votre situation professionnelle actuelle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="step3.profession"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Profession & Fonction *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Ingénieur Logiciel"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step3.employer"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nom de l'employeur *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Nixacom (Indiquez 'Sans emploi' si applicable)"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>Accepte la valeur "Sans emploi"</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step3.employedSince"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ancienneté / Depuis quand *</FormLabel>
              <FormControl>
                <Input
                  type="month"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>Format: Mois/Année</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
