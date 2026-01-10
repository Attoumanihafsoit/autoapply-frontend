import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, PenTool, Shield, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import SecurityBadges from '@/components/SecurityBadges';

const Landing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      titleKey: 'feature.form.title',
      descriptionKey: 'feature.form.description',
    },
    {
      icon: PenTool,
      titleKey: 'feature.autofill.title',
      descriptionKey: 'feature.autofill.description',
    },
    {
      icon: Shield,
      titleKey: 'feature.audit.title',
      descriptionKey: 'feature.audit.description',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient-subtle">
        <div className="container py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium mb-4 animate-fade-in">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-muted-foreground mb-10 animate-fade-in">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button
                size="lg"
                className="gap-2 text-lg px-8"
                onClick={() => navigate('/onboarding/mode')}
              >
                {t('hero.cta.start')}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-lg px-8"
                onClick={() => navigate('/admin')}
              >
                <Users className="h-5 w-5" />
                {t('hero.cta.demo')}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, titleKey, descriptionKey }, index) => (
              <div
                key={titleKey}
                className="card-feature group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{t(titleKey)}</h3>
                <p className="text-muted-foreground">{t(descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Banners */}
      <section className="py-12 bg-accent/30">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 justify-center text-center">
            <div className="flex items-center gap-3 justify-center p-4 bg-background rounded-xl border">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('message.auditLogged')}</span>
            </div>
            <div className="flex items-center gap-3 justify-center p-4 bg-background rounded-xl border">
              <Building className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{t('message.bothModes')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Badges */}
      <section className="py-16 bg-background">
        <div className="container">
          <SecurityBadges />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nixacom. AutoApply — Simulation Demo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
