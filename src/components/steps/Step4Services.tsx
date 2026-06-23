import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type OnboardingFormValues } from '@/lib/validations/onboarding';

export const Step4Services = () => {
  const { control, watch } = useFormContext<OnboardingFormValues>();

  const openIndividualAccount = watch('step4.openIndividualAccount');
  const requestCheckbook = watch('step4.requestCheckbook');
  const activateOrangeMoney = watch('step4.activateOrangeMoney');
  const cardType = watch('step4.cardType');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Services bancaires souhaités</h2>
        <p className="text-muted-foreground mt-1">
          Personnalisez vos services bancaires et moyens de paiement.
        </p>
      </div>

      <div className="space-y-6">
        {/* Ouverture de compte */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <FormField
            control={control}
            name="step4.openIndividualAccount"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">Souhaitez-vous ouvrir un compte particulier ? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="yes" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="no" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Non</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Demande de chéquier */}
        {openIndividualAccount === 'yes' && (
          <div className="p-4 bg-muted/30 rounded-lg border space-y-6 animate-in fade-in zoom-in-95">
            <FormField
              control={control}
              name="step4.requestCheckbook"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Demande de chéquier *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-6"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="yes" /></FormControl>
                        <FormLabel className="font-normal cursor-pointer">Oui</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="no" /></FormControl>
                        <FormLabel className="font-normal cursor-pointer">Non</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {requestCheckbook === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <FormField
                  control={control}
                  name="step4.numberOfCheckbooks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de carnets de chèques *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="step4.checkbookType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type de chèques *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="crossed" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Barrés</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="uncrossed" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Non barrés</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* Demande de carte bancaire */}
        <div className="p-4 bg-muted/30 rounded-lg border space-y-6">
          <FormField
            control={control}
            name="step4.requestCard"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">Demande de carte bancaire</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="yes" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="no" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Non</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watch('step4.requestCard') === 'yes' && (
            <FormField
              control={control}
              name="step4.cardType"
              render={({ field }) => (
                <FormItem className="space-y-3 pt-4 border-t">
                  <FormLabel>Type de carte *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <FormItem 
                        onClick={() => field.onChange('azur')}
                        className={`flex flex-col items-center justify-center space-y-2 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary transition-all ${cardType === 'azur' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''}`}
                      >
                        <FormControl><RadioGroupItem value="azur" className="sr-only" /></FormControl>
                        <div className="h-12 w-20 bg-blue-500 rounded-md shadow-sm mb-2" />
                        <FormLabel className="font-semibold cursor-pointer pointer-events-none">Azur</FormLabel>
                        <p className="text-xs text-center text-muted-foreground pointer-events-none">Plafond : 500k FCFA/mois</p>
                      </FormItem>
                      <FormItem 
                        onClick={() => field.onChange('elite')}
                        className={`flex flex-col items-center justify-center space-y-2 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary transition-all ${cardType === 'elite' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''}`}
                      >
                        <FormControl><RadioGroupItem value="elite" className="sr-only" /></FormControl>
                        <div className="h-12 w-20 bg-slate-800 rounded-md shadow-sm mb-2" />
                        <FormLabel className="font-semibold cursor-pointer pointer-events-none">Elite</FormLabel>
                        <p className="text-xs text-center text-muted-foreground pointer-events-none">Plafond : 2M FCFA/mois</p>
                      </FormItem>
                      <FormItem 
                        onClick={() => field.onChange('platine')}
                        className={`flex flex-col items-center justify-center space-y-2 p-4 border rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary transition-all ${cardType === 'platine' ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''}`}
                      >
                        <FormControl><RadioGroupItem value="platine" className="sr-only" /></FormControl>
                        <div className="h-12 w-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-md shadow-sm mb-2" />
                        <FormLabel className="font-semibold cursor-pointer pointer-events-none">Platine</FormLabel>
                        <p className="text-xs text-center text-muted-foreground pointer-events-none">Plafond : 10M FCFA/mois</p>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Orange Money */}
        <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900 space-y-6">
          <FormField
            control={control}
            name="step4.activateOrangeMoney"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base text-orange-600 dark:text-orange-400">Activation Orange Money / OMBA</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="yes" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="no" /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Non</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {activateOrangeMoney === 'yes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-orange-200 dark:border-orange-900">
              <FormField
                control={control}
                name="step4.orangeMoneyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro Orange Money *</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        placeholder="77XXXXXXX"
                        className="transition-all duration-200 focus:ring-2 focus:ring-orange-500/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="step4.orangeMoneyAction"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Action OMBA *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="activation" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Activation</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value="deactivation" /></FormControl>
                          <FormLabel className="font-normal cursor-pointer">Désactivation</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
