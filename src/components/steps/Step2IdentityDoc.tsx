import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type OnboardingFormValues } from '@/types/onboarding';

export const Step2IdentityDoc = () => {
  const { control } = useFormContext<OnboardingFormValues>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Pièce d'identité</h2>
        <p className="text-muted-foreground mt-1">
          Renseignez les informations de votre pièce d'identité. Ces champs seront pré-remplis si vous scannez votre pièce plus tard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="step2.idType"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Type de pièce *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="Sélectionnez un type de pièce" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cni">Carte Nationale d'Identité (CNI)</SelectItem>
                  <SelectItem value="passport">Passeport</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step2.idNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de la pièce *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="EX: 1234567890"
                  className="uppercase transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step2.idIssuePlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu d'émission *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Dakar"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step2.idIssueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'émission *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="step2.idExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'expiration *</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormDescription>La pièce doit être valide pour au moins 6 mois.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
