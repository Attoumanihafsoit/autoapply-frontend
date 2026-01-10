import { useNavigate } from 'react-router-dom';
import { Building2, Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import type { OnboardingMode } from '@/types/onboarding';

const OnboardingModeSelect = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleModeSelect = (mode: OnboardingMode) => {
    navigate(`/onboarding/wizard?mode=${mode}`);
  };

  const modes = [
    {
      mode: 'in-branch' as OnboardingMode,
      icon: Building2,
      titleKey: 'mode.inBranch.title',
      descriptionKey: 'mode.inBranch.description',
      color: 'primary',
    },
    {
      mode: 'remote' as OnboardingMode,
      icon: Globe,
      titleKey: 'mode.remote.title',
      descriptionKey: 'mode.remote.description',
      color: 'primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{t('mode.title')}</h1>
          <p className="text-muted-foreground">
            Sélectionnez le mode d'onboarding adapté à votre situation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {modes.map(({ mode, icon: Icon, titleKey, descriptionKey }) => (
            <button
              key={mode}
              onClick={() => handleModeSelect(mode)}
              className="card-feature text-left group cursor-pointer hover:border-primary/50 hover:shadow-xl transition-all p-8"
            >
              <div className="flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(titleKey)}</h3>
                <p className="text-muted-foreground flex-1">{t(descriptionKey)}</p>
                <div className="mt-6 flex items-center text-primary font-medium">
                  Commencer
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default OnboardingModeSelect;
