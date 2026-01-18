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

      {/* Trust Badges - Banking Partners */}
      {/* <section className="py-10 border-b border-border/40 bg-white/50 backdrop-blur-sm">
        <div className="container">
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Partenaires de Confiance</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {['BIMAO', 'WAVE', 'CREDIT BUREAU'].map((partner) => (
              <div key={partner} className="text-xl font-bold text-slate-400 hover:text-primary cursor-default">{partner}</div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Modern Features Grid */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Une expérience bancaire réinventée
            </h2>
            <p className="text-muted-foreground text-lg">
              Fini la paperasse. Ouvrez votre compte, signez vos contrats et obtenez vos moyens de paiement en moins de 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, titleKey, descriptionKey }, index) => (
              <div
                key={titleKey}
                className="group relative bg-white dark:bg-card border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{t(titleKey)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Steps */}
      <section className="py-24 bg-slate-50 dark:bg-muted/10 relative">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <p className="text-muted-foreground">Trois étapes simples vers votre nouveau compte</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            {[
              { step: "01", title: "Identifiez-vous", desc: "Utilisez votre caméra pour scanner votre CNI ou Passeport." },
              { step: "02", title: "Complétez", desc: "Vérifiez les informations pré-remplies et choisissez vos options." },
              { step: "03", title: "Signez le pack", desc: "Obtenez instantanément vos contrats Wave, Carte et Compte." }
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-2xl font-bold text-primary shadow-lg mb-6 z-10 group-hover:border-primary/20 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-20 bg-primary/5 border-y border-primary/10">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Shield className="h-4 w-4" />
                Sécurité Bancaire
              </div>
              <h2 className="text-3xl font-bold mb-4">Vos données sont protégées</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Nous utilisons des protocoles de chiffrement de niveau bancaire. Vos documents sont traités de manière sécurisée et ne sont jamais partagés sans votre consentement explicite.
              </p>
              <SecurityBadges />
            </div>
            <div className="lg:w-1/2 relative">
              {/* Abstract visual for security */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="relative bg-white dark:bg-card p-8 rounded-2xl shadow-xl border border-border/50">
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Conformité RGPD / BCEAO</h4>
                    <p className="text-xs text-muted-foreground">Protection des données personnelles</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">Signature Électronique</h4>
                    <p className="text-xs text-muted-foreground">Valeur légale probante (eIDAS)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
